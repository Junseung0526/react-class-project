import { useState, useCallback } from 'react';
import Modal from './components/Modal';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import RealtimeNewsView from './components/RealtimeNewsView';
import TopNewsView from './components/TopNewsView';
import ScrappedNewsView from './components/ScrappedNewsView';
import CustomNewsView from './components/CustomNewsView';
import ThemeToggle from './components/ThemeToggle';
import { useNewsData } from './hooks/useNewsData';
import { useScrappedNews } from './hooks/useScrappedNews';
import styles from './styles/App.module.css';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [sortOrder, setSortOrder] = useState('sim');
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTab, setActiveTab] = useState('custom');

  const { scrappedNews, handleScrap, handleRemoveScrap } = useScrappedNews();
  const { newsItems, loading, error, hasMoreNews, handleLoadMore } = useNewsData(
    jobTitle,
    customKeywords,
    sortOrder,
    activeTab
  );

  const handleJobSubmit = useCallback((newJobTitle) => {
    setJobTitle(newJobTitle);
    setCustomKeywords([]);
  }, []);

  const openModal = (item) => {
    setSelectedNews(item);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'custom':
        return (
          <CustomNewsView
            jobTitle={jobTitle}
            onJobSubmit={handleJobSubmit}
            customKeywords={customKeywords}
            setCustomKeywords={setCustomKeywords}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            newsItems={newsItems}
            loading={loading}
            error={error}
            hasMoreNews={hasMoreNews}
            handleLoadMore={handleLoadMore}
            openModal={openModal}
            handleScrap={handleScrap}
          />
        );
      case 'realtime':
        return <RealtimeNewsView onScrap={handleScrap} />;
      case 'top':
        return <TopNewsView onScrap={handleScrap} />;
      case 'scrapped':
        return <ScrappedNewsView items={scrappedNews} onRemove={handleRemoveScrap} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.themeToggle}>
            <ThemeToggle />
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>뉴스 브리핑</h1>
          </div>
          <p className={styles.subtitle}>
            맞춤 분석, 실시간 뉴스, 주요 토픽까지 한눈에
          </p>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className={styles.main}>
          {renderContent()}
        </main>

        <Modal item={selectedNews} onClose={closeModal} keywords={[jobTitle, ...customKeywords].filter(Boolean)} />
      </div>
      <Footer />
    </div>
  );
}

export default App;