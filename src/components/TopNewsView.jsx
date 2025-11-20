import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utils/api';
import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/TopNews.module.css';

const TOPICS = ['IT', '경제', '사회', '생활/문화'];

export default function TopNewsView({ onScrap }) {
  const [newsByTopic, setNewsByTopic] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopNews = async () => {
      try {
        setLoading(true);
        const promises = TOPICS.map(topic => fetchNewsData(topic, 'sim'));
        const results = await Promise.all(promises);

        const newsData = {};
        results.forEach((result, index) => {
          const topic = TOPICS[index];
          const uniqueNews = Array.from(new Map(result.map(item => [item.originallink, item])).values());
          newsData[topic] = uniqueNews.slice(0, 6);
        });

        setNewsByTopic(newsData);
      } catch (err) {
        setError('주요 토픽 뉴스를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTopNews();
  }, []);

  if (loading) {
    return <div className={styles.loading}>주요 토픽 뉴스를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {TOPICS.map(topic => (
        <section key={topic} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{topic}</h2>
          <div className={styles.newsList}>
            {newsByTopic[topic]?.map(item => (
              <SimpleNewsItem key={item.link} item={item} onScrap={onScrap} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};