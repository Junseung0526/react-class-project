import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // Proxy requests to the Naver News API
        '/naver-news-proxy': {
          target: 'https://openapi.naver.com',
          changeOrigin: true,
          secure: false, // Often needed when proxying to HTTPS targets
          rewrite: (path) => path.replace(/^\/naver-news-proxy/, '/v1/search/news.json'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add Naver API headers to the proxied request
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
