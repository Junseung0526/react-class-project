import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utils/api';
import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/RealtimeNews.module.css';

const RealtimeNewsView = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRealtimeNews = async () => {
      try {
        setLoading(true);
        // Fetch news sorted by date for "real-time" effect
        const fetchedNews = await fetchNewsData('주요 뉴스', 'date');
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
  }, []);

  if (loading) {
    return <div className={styles.loading}>실시간 뉴스를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.newsList}>
        {news.map(item => (
          <SimpleNewsItem key={item.link} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RealtimeNewsView;
