// React 훅, API 유틸리티, 그리고 관련 컴포넌트들을 임포트합니다.
import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utils/api';
import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/TopNews.module.css';

// 뉴스 토픽들을 상수로 정의합니다.
const TOPICS = ['IT', '경제', '사회', '생활/문화'];

// 주요 토픽별 뉴스를 보여주는 뷰 컴포넌트입니다.
export default function TopNewsView({ onScrap }) {
  // --- 상태 관리 ---
  const [newsByTopic, setNewsByTopic] = useState({}); // 토픽별 뉴스 데이터를 저장하는 객체
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // --- 효과 훅 (useEffect) ---

  // 컴포넌트가 마운트될 때, 각 토픽에 대한 뉴스를 가져옵니다.
  useEffect(() => {
    const getTopNews = async () => {
      try {
        setLoading(true);
        // 정의된 모든 토픽에 대해 동시에 뉴스 데이터 요청을 보냅니다.
        const promises = TOPICS.map(topic => fetchNewsData(topic, 'sim'));
        const results = await Promise.all(promises);

        const newsData = {};
        // 각 토픽의 결과를 처리합니다.
        results.forEach((result, index) => {
          const topic = TOPICS[index];
          // 중복 뉴스를 제거합니다.
          const uniqueNews = Array.from(new Map(result.map(item => [item.originallink, item])).values());
          // 각 토픽별로 최대 6개의 뉴스만 저장합니다.
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
  }, []); // 빈 종속성 배열은 이 효과가 컴포넌트 마운트 시 한 번만 실행되도록 합니다.

  // --- 렌더링 로직 ---

  // 로딩 중일 때 표시할 UI 입니다.
  if (loading) {
    return <div className={styles.loading}>주요 토픽 뉴스를 불러오는 중...</div>;
  }

  // 에러가 발생했을 때 표시할 UI 입니다.
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // 토픽별로 뉴스 목록을 렌더링합니다.
  return (
    <div className={styles.container}>
      {TOPICS.map(topic => (
        <section key={topic} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{topic}</h2>
          <div className={styles.newsList}>
            {/* 해당 토픽의 뉴스 배열을 순회하며 SimpleNewsItem 컴포넌트를 렌더링합니다. */}
            {newsByTopic[topic]?.map(item => (
              <SimpleNewsItem key={item.link} item={item} onScrap={onScrap} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};