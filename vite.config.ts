import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // OpenMAIC component paths — map @/components/X to openmaic subfolder
        '@/components/whiteboard': path.resolve(__dirname, './src/components/openmaic/whiteboard'),
        '@/components/canvas': path.resolve(__dirname, './src/components/openmaic/canvas'),
        '@/components/chat': path.resolve(__dirname, './src/components/openmaic/chat'),
        '@/components/audio': path.resolve(__dirname, './src/components/openmaic/audio'),
        '@/components/generation': path.resolve(__dirname, './src/components/openmaic/generation'),
        '@/components/roundtable': path.resolve(__dirname, './src/components/openmaic/roundtable'),
        '@/components/stage': path.resolve(__dirname, './src/components/openmaic/stage'),
        '@/components/scene-renderers': path.resolve(__dirname, './src/components/openmaic/scene-renderers'),
        '@/components/slide-renderer': path.resolve(__dirname, './src/components/openmaic/slide-renderer'),
        '@/components/ai-elements': path.resolve(__dirname, './src/components/openmaic/ai-elements'),
        '@/components/access-code-modal': path.resolve(__dirname, './src/components/openmaic/access-code-modal'),
        '@/configs': path.resolve(__dirname, './src/configs'),
        // OpenMAIC lib paths — specific stubs first, then wildcard to openmaic-lib
        '@/lib/hooks/use-i18n': path.resolve(__dirname, './src/lib/hooks/use-i18n'),
        '@/lib/store/canvas': path.resolve(__dirname, './src/lib/store/canvas'),
        '@/lib/store/settings': path.resolve(__dirname, './src/lib/store/settings'),
        '@/lib/store/whiteboard-history': path.resolve(__dirname, './src/lib/store/whiteboard-history'),
        '@/lib/api/stage-api': path.resolve(__dirname, './src/lib/api/stage-api'),
        '@/lib/audio/browser-tts': path.resolve(__dirname, './src/lib/audio/browser-tts'),
        '@/lib/audio/types': path.resolve(__dirname, './src/lib/audio/types'),
        '@/lib/audio/voice-resolver': path.resolve(__dirname, './src/lib/audio/voice-resolver'),
        '@/lib/audio/browser-tts-preview': path.resolve(__dirname, './src/lib/audio/browser-tts-preview'),
        '@/lib/audio/voxcpm-voices': path.resolve(__dirname, './src/lib/audio/voxcpm-voices'),
        '@/lib/audio/voxcpm': path.resolve(__dirname, './src/lib/audio/voxcpm'),
        '@/lib/orchestration/registry': path.resolve(__dirname, './src/lib/orchestration/registry'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    optimizeDeps: {
      exclude: ['@mlc-ai/web-llm'],
    },
  };
});
