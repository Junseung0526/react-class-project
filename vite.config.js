import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: mode === 'production' ? "/react-class-project/" : "/",
    build: {
      outDir: "docs",
    },
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/naver-news-proxy': {
          target: 'https://openapi.naver.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/naver-news-proxy/, '/v1/search/news.json'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              if (env.VITE_NAVER_CLIENT_ID && env.VITE_NAVER_CLIENT_SECRET) {
                proxyReq.setHeader('X-Naver-Client-Id', env.VITE_NAVER_CLIENT_ID);
                proxyReq.setHeader('X-Naver-Client-Secret', env.VITE_NAVER_CLIENT_SECRET);
              } else {
                console.error("Naver API credentials (VITE_NAVER_CLIENT_ID or VITE_NAVER_CLIENT_SECRET) are missing in your .env file.");
              }
            });
          },
        },
      },
    },
  };
});
