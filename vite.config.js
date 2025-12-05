import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // .env 파일 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. 배포 시 GitHub 리포지토리 이름 경로 설정 (가장 중요)
    base: mode === 'production' ? "/react-class-project/" : "/",

    // 2. 빌드 결과물 폴더 설정 (기본값인 'dist' 사용 권장)
    build: {
      outDir: "dist", 
    },

    plugins: [react()],

    // 3. 로컬 개발용 서버 설정
    // 주의: 이 proxy 설정은 'npm run dev'에서만 작동하며, GitHub Pages 배포 후에는 작동하지 않습니다.
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