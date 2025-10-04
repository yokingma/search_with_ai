import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      outDir: 'dist'
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        }),
        TDesignResolver({
          library: 'chat'
        })]
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        }), TDesignResolver({
          library: 'chat'
        })]
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
