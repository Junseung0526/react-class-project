// React 훅과 API 함수, 그리고 하위 컴포넌트를 임포트합니다.
import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utils/api';
import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/RealtimeNews.module.css';

// 실시간 뉴스 뷰를 담당하는 컴포넌트입니다.
export default function RealtimeNewsView({ onScrap }) {
  // --- 상태 관리 ---
  const [news, setNews] = useState([]); // 뉴스 아이템 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // --- 효과 훅 (useEffect) ---

  // 컴포넌트가 마운트될 때 실시간 뉴스를 가져옵니다.
  useEffect(() => {
    const getRealtimeNews = async () => {
      try {
        setLoading(true);
        // '주요 뉴스'를 키워드로 날짜순으로 뉴스를 가져옵니다.
        const fetchedNews = await fetchNewsData('주요 뉴스', 'date');
        // 가져온 뉴스에서 중복된 항목을 제거합니다.
        const uniqueNews = Array.from(new Map(fetchedNews.map(item => [item.originallink, item])).values());
        setNews(uniqueNews);
      } catch (err) {
        setError('실시간 뉴스를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getRealtimeNews();
  }, []); // 빈 종속성 배열은 이 효과가 컴포넌트 마운트 시 한 번만 실행되도록 합니다.

  // --- 렌더링 로직 ---

  // 로딩 중일 때 표시할 UI 입니다.
  if (loading) {
    return <div className={styles.loading}>실시간 뉴스를 불러오는 중...</div>;
  }

  // 에러가 발생했을 때 표시할 UI 입니다.
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  // 뉴스 목록을 렌더링합니다.
  return (
    <div className={styles.container}>
      <div className={styles.newsList}>
        {news.map(item => (
          <SimpleNewsItem key={item.link} item={item} onScrap={onScrap} />
        ))}
      </div>
    </div>
  );
};