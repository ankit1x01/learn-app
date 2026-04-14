package com.chitta.app

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.ai.edge.litertlm.Backend
import com.google.ai.edge.litertlm.Content
import com.google.ai.edge.litertlm.Contents
import com.google.ai.edge.litertlm.Conversation
import com.google.ai.edge.litertlm.ConversationConfig
import com.google.ai.edge.litertlm.Engine
import com.google.ai.edge.litertlm.EngineConfig
import com.google.ai.edge.litertlm.Message
import com.google.ai.edge.litertlm.MessageCallback
import com.google.ai.edge.litertlm.SamplerConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.concurrent.CancellationException

private const val TAG = "LlmPlugin"

private const val MODEL_PATH =
    "/storage/emulated/0/Android/data/com.google.ai.edge.gallery/files/Gemma_4_E4B_it/20260325/gemma4_4b_v09_obfus_fix_all_modalities_thinking.litertlm"

@CapacitorPlugin(name = "LlmPlugin")
class LlmPlugin : Plugin() {

    private var engine: Engine? = null
    private var conversation: Conversation? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    // Initialize the engine — call once on app start
    @PluginMethod
    fun initialize(call: PluginCall) {
        scope.launch {
            try {
                Log.d(TAG, "Initializing LiteRT LM engine...")
                val engineConfig = EngineConfig(
                    modelPath = MODEL_PATH,
                    backend = Backend.GPU(),
                    maxNumTokens = 2048,
                )
                val e = Engine(engineConfig)
                e.initialize()

                val conv = e.createConversation(
                    ConversationConfig(
                        samplerConfig = SamplerConfig(
                            topK = 40,
                            topP = 0.95,
                            temperature = 0.7,
                        ),
                    )
                )

                engine = e
                conversation = conv
                Log.d(TAG, "Engine initialized.")
                call.resolve(JSObject().put("status", "ready"))
            } catch (e: Exception) {
                Log.e(TAG, "Init failed: ${e.message}")
                call.reject("Init failed: ${e.message}")
            }
        }
    }

    // Send a message and stream tokens back via events
    @PluginMethod
    fun chat(call: PluginCall) {
        val input = call.getString("input") ?: return call.reject("Missing input")
        val conv = conversation ?: return call.reject("Not initialized. Call initialize() first.")

        scope.launch {
            try {
                conv.sendMessageAsync(
                    Contents.of(listOf(Content.Text(input))),
                    object : MessageCallback {
                        override fun onMessage(message: Message) {
                            val event = JSObject()
                            event.put("token", message.toString())
                            event.put("done", false)
                            notifyListeners("llmToken", event)
                        }

                        override fun onDone() {
                            val event = JSObject()
                            event.put("token", "")
                            event.put("done", true)
                            notifyListeners("llmToken", event)
                            call.resolve(JSObject().put("status", "done"))
                        }

                        override fun onError(throwable: Throwable) {
                            if (throwable is CancellationException) {
                                val event = JSObject()
                                event.put("token", "")
                                event.put("done", true)
                                notifyListeners("llmToken", event)
                                call.resolve(JSObject().put("status", "cancelled"))
                            } else {
                                call.reject("Inference error: ${throwable.message}")
                            }
                        }
                    },
                    emptyMap(),
                )
            } catch (e: Exception) {
                call.reject("Chat error: ${e.message}")
            }
        }
    }

    // Reset conversation history (new chat session)
    @PluginMethod
    fun resetConversation(call: PluginCall) {
        scope.launch {
            try {
                conversation?.close()
                conversation = engine?.createConversation(
                    ConversationConfig(
                        samplerConfig = SamplerConfig(topK = 40, topP = 0.95, temperature = 0.7),
                    )
                )
                call.resolve(JSObject().put("status", "reset"))
            } catch (e: Exception) {
                call.reject("Reset failed: ${e.message}")
            }
        }
    }

    // Stop ongoing generation
    @PluginMethod
    fun stopResponse(call: PluginCall) {
        conversation?.cancelProcess()
        call.resolve(JSObject().put("status", "stopped"))
    }

    // Release engine from memory
    @PluginMethod
    fun cleanUp(call: PluginCall) {
        scope.launch {
            try {
                conversation?.close()
                engine?.close()
                conversation = null
                engine = null
                call.resolve(JSObject().put("status", "cleaned"))
            } catch (e: Exception) {
                call.reject("CleanUp failed: ${e.message}")
            }
        }
    }
}
