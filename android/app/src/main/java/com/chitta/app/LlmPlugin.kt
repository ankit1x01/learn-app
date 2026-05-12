package com.chitta.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import android.util.Log
import com.getcapacitor.JSArray
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
import java.io.File
import java.util.concurrent.CancellationException

private const val TAG = "LlmPlugin"
private const val GALLERY_ROOT = "/storage/emulated/0/Android/data/com.google.ai.edge.gallery/files"

@CapacitorPlugin(name = "LlmPlugin")
class LlmPlugin : Plugin() {

    private var engine: Engine? = null
    private var conversation: Conversation? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    // Returns whether MANAGE_EXTERNAL_STORAGE is currently granted
    @PluginMethod
    fun checkStoragePermission(call: PluginCall) {
        val granted = Build.VERSION.SDK_INT < Build.VERSION_CODES.R || Environment.isExternalStorageManager()
        call.resolve(JSObject().put("granted", granted))
    }

    // Opens the "All Files Access" settings page for this app
    @PluginMethod
    fun requestStoragePermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
            try {
                val intent = Intent(
                    Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION,
                    Uri.parse("package:${activity.packageName}")
                )
                activity.startActivity(intent)
                call.resolve(JSObject().put("opened", true))
            } catch (e: Exception) {
                // Fallback: open general storage access settings
                val fallback = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
                activity.startActivity(fallback)
                call.resolve(JSObject().put("opened", true))
            }
        } else {
            call.resolve(JSObject().put("opened", false).put("alreadyGranted", true))
        }
    }

    // Scan AI Edge Gallery storage for downloaded models
    @PluginMethod
    fun scanModels(call: PluginCall) {
        scope.launch {
            try {
                val galleryDir = File(GALLERY_ROOT)
                val models = JSArray()

                if (galleryDir.exists() && galleryDir.isDirectory) {
                    galleryDir.listFiles()?.forEach { modelDir ->
                        if (!modelDir.isDirectory) return@forEach
                        // Each model folder may have one or more version subdirectories
                        val versionDirs = modelDir.listFiles()?.filter { it.isDirectory }
                        if (versionDirs.isNullOrEmpty()) {
                            // Flat layout: model files directly in modelDir
                            modelDir.listFiles()?.forEach { file ->
                                if (file.name.endsWith(".litertlm") || file.name.endsWith(".task")) {
                                    models.put(buildModelJson(modelDir.name, "", file))
                                }
                            }
                        } else {
                            versionDirs.forEach { versionDir ->
                                versionDir.listFiles()?.forEach { file ->
                                    if (file.name.endsWith(".litertlm") || file.name.endsWith(".task")) {
                                        models.put(buildModelJson(modelDir.name, versionDir.name, file))
                                    }
                                }
                            }
                        }
                    }
                }

                Log.d(TAG, "Found ${models.length()} model files in AI Edge Gallery")
                call.resolve(JSObject().put("models", models))
            } catch (e: Exception) {
                Log.e(TAG, "scanModels failed: ${e.message}")
                call.reject("Scan failed: ${e.message}")
            }
        }
    }

    private fun buildModelJson(folderName: String, version: String, file: File): JSObject {
        val obj = JSObject()
        obj.put("id", folderName)
        obj.put("displayName", folderName.replace("_", " ").replace("-", " "))
        obj.put("version", version)
        obj.put("fileName", file.name)
        obj.put("path", file.absolutePath)
        obj.put("sizeBytes", file.length())
        obj.put("type", if (file.name.endsWith(".litertlm")) "litertlm" else "task")
        return obj
    }

    // Initialize engine with a dynamic model path
    @PluginMethod
    fun initialize(call: PluginCall) {
        val modelPath = call.getString("path")
            ?: return call.reject("Missing 'path' parameter")

        scope.launch {
            try {
                // Release any previously loaded engine
                conversation?.close()
                engine?.close()
                conversation = null
                engine = null

                Log.d(TAG, "Loading model: $modelPath")
                val engineConfig = EngineConfig(
                    modelPath = modelPath,
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
                Log.d(TAG, "Engine ready for: $modelPath")
                call.resolve(JSObject().put("status", "ready"))
            } catch (e: Exception) {
                Log.e(TAG, "Initialize failed: ${e.message}")
                call.reject("Init failed: ${e.message}")
            }
        }
    }

    // Send a message and stream tokens back via events
    @PluginMethod
    fun chat(call: PluginCall) {
        val input = call.getString("input") ?: return call.reject("Missing 'input' parameter")
        val conv = conversation ?: return call.reject("Engine not initialized. Call initialize() first.")

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
                                Log.e(TAG, "Inference error: ${throwable.message}")
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

    // Reset conversation context (new chat session, same loaded model)
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

    // Cancel ongoing generation
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
