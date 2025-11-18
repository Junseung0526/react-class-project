import { useState, useEffect, useCallback } from 'react';
import JobInput from './components/JobInput';
import KeywordInput from './components/KeywordInput';
import NewsItem from './components/NewsItem';
import Modal from './components/Modal';
import Footer from './components/Footer';
import NewsItemSkeleton from './components/NewsItemSkeleton';
import Navigation from './components/Navigation';
import RealtimeNewsView from './components/RealtimeNewsView';
import TopNewsView from './components/TopNewsView';
import ScrappedNewsView from './components/ScrappedNewsView';
import ThemeToggle from './components/ThemeToggle';
import { DEFAULT_KEYWORDS, MAX_CUSTOM_KEYWORDS } from './utils/constants';
import { fetchNewsData } from './utils/api';
import styles from './styles/App.module.css';

function App() {
  // State for Custom AI News
  const [jobTitle, setJobTitle] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('sim');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hasMoreNews, setHasMoreNews] = useState(true);

  // State for UI
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTab, setActiveTab] = useState('custom');

  // State for Scrapped News
  const [scrappedNews, setScrappedNews] = useState([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('scrapped_news');
    if (savedNews) {
      setScrappedNews(JSON.parse(savedNews));
    }
  }, []);

  // Effect to reset news when search/sort criteria change
  useEffect(() => {
    setNewsItems([]);
    setCurrentPage(1);
    setHasMoreNews(true);
  }, [jobTitle, sortOrder]);

  // Effect to fetch news when page or criteria change
  useEffect(() => {
    if (!jobTitle || activeTab !== 'custom') {
      setNewsItems([]);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = [jobTitle, ...customKeywords, ...DEFAULT_KEYWORDS].join(' ');
        const start = (currentPage - 1) * itemsPerPage + 1;
        const fetchedNews = await fetchNewsData(query, sortOrder, start, itemsPerPage);

        const processedItems = fetchedNews.map(item => ({
          ...item,
          summary: item.description.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<b>/g, '').replace(/<\/b>/g, ''),
          tags: [],
          isProcessing: false
        }));

        setNewsItems(prevItems => {
          const allItems = currentPage === 1 ? processedItems : [...prevItems, ...processedItems];
          const uniqueItems = Array.from(new Map(allItems.map(item => [item.originallink, item])).values());
          return uniqueItems;
        });

        setHasMoreNews(processedItems.length === itemsPerPage);
      } catch (err) {
        setError("뉴스 데이터를 불러오거나 처리하는 데 실패했습니다.");
        console.error("App.jsx fetchNews error:", err);
        setHasMoreNews(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [jobTitle, customKeywords, sortOrder, currentPage, activeTab, itemsPerPage]);

  const handleScrap = (itemToScrap) => {
    if (scrappedNews.some(item => item.originallink === itemToScrap.originallink)) {
      alert('이미 스크랩한 기사입니다.');
      return;
    }
    const updatedScrappedNews = [...scrappedNews, itemToScrap];
    setScrappedNews(updatedScrappedNews);
    localStorage.setItem('scrapped_news', JSON.stringify(updatedScrappedNews));
    alert('기사를 스크랩했습니다.');
  };

  const handleRemoveScrap = (itemToRemove) => {
    const updatedScrappedNews = scrappedNews.filter(item => item.originallink !== itemToRemove.originallink);
    setScrappedNews(updatedScrappedNews);
    localStorage.setItem('scrapped_news', JSON.stringify(updatedScrappedNews));
  };

  const handleJobSubmit = useCallback((newJobTitle) => {
    setJobTitle(newJobTitle);
    setCustomKeywords([]);
  }, []);

  const openModal = (item) => {
    if (item.isProcessing) return;
    setSelectedNews(item);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  const handleLoadMore = () => {
    if (!loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'custom':
        return (
          <>
            <div className={styles.inputSection}>
              <JobInput onJobSubmit={handleJobSubmit} initialJob={jobTitle} />
              {jobTitle && (
                <KeywordInput keywords={customKeywords} setKeywords={setCustomKeywords} maxKeywords={MAX_CUSTOM_KEYWORDS} />
              )}
            </div>

            {jobTitle && (
              <div className={styles.sortContainer}>
                <button
                  className={`${styles.sortButton} ${sortOrder === 'sim' ? styles.activeSort : ''}`}
                  onClick={() => setSortOrder('sim')}
                >
                  관련도순
                </button>
                <button
                  className={`${styles.sortButton} ${sortOrder === 'date' ? styles.activeSort : ''}`}
                  onClick={() => setSortOrder('date')}
                >
                  날짜순
                </button>
              </div>
            )}

            {loading && newsItems.length === 0 && <div className={styles.loading}>뉴스 목록을 불러오는 중입니다...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.newsGrid}>
              {newsItems.map((item, index) =>
                item.isProcessing ? (
                  <NewsItemSkeleton key={item.link || index} />
                ) : (
                  <NewsItem key={item.originallink || index} item={item} onItemClick={openModal} onScrap={handleScrap} />
                )
              )}
            </div>
            {hasMoreNews && !loading && newsItems.length > 0 && (
              <div className={styles.loadMoreContainer}>
                <button onClick={handleLoadMore} className={styles.loadMoreButton} disabled={loading}>
                  더 많은 뉴스 보기
                </button>
              </div>
            )}
            {loading && newsItems.length > 0 && <div className={styles.loading}>더 많은 뉴스 불러오는 중...</div>}
            {!loading && !hasMoreNews && newsItems.length > 0 && (
              <div className={styles.noMoreNews}>더 이상 뉴스가 없습니다.</div>
            )}
            {!loading && newsItems.length === 0 && jobTitle && !error && (
              <div className={styles.noResults}>입력된 직무와 키워드에 해당하는 뉴스가 없습니다.</div>
            )}
          </>
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
    <div className={styles.appContainer}>
      <div className={styles.app}>
        <header className={styles.header}>
            <div className={styles.themeToggleContainer}>
              <ThemeToggle />
            </div>
          <div className={styles.titleContainer}>
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
