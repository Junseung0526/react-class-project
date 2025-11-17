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
import { fetchNewsData, summarizeAndTag } from './utils/api';
import styles from './styles/App.module.css';

function App() {
  // State for Custom AI News
  const [jobTitle, setJobTitle] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for UI
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTab, setActiveTab] = useState('custom'); // 'custom', 'realtime', 'top', 'scrapped'

  // State for Scrapped News
  const [scrappedNews, setScrappedNews] = useState([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('scrapped_news');
    if (savedNews) {
      setScrappedNews(JSON.parse(savedNews));
    }
  }, []);

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

  const fetchAndProcessNews = useCallback(async () => {
    if (!jobTitle || activeTab !== 'custom') {
      setNewsItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const allKeywords = [jobTitle, ...customKeywords, ...DEFAULT_KEYWORDS];
      const uniqueKeywords = [...new Set(allKeywords)];
      const query = uniqueKeywords.join(' ');

      const fetchedNews = await fetchNewsData(query);
      const uniqueNews = Array.from(new Map(fetchedNews.map(item => [item.originallink, item])).values());
      const persona = `당신은 ${jobTitle} 전문가입니다. 기사를 ${jobTitle}의 관점에서 분석하고 요약해주세요.`;

      const initialItems = uniqueNews.map(item => ({ ...item, isProcessing: true, summary: '', tags: [] }));
      setNewsItems(initialItems);
      setLoading(false);

      for (let i = 0; i < initialItems.length; i++) {
        const item = initialItems[i];
        let fromCache = false;
        try {
          const result = await summarizeAndTag(item, persona);
          const { summary, tags } = result;
          fromCache = result.fromCache;

          setNewsItems(prevItems =>
            prevItems.map(prevItem =>
              prevItem.link === item.link
                ? { ...prevItem, summary, tags, isProcessing: false }
                : prevItem
            )
          );
        } catch (aiError) {
          console.error("Error processing news with AI:", aiError);
          setNewsItems(prevItems =>
            prevItems.map(prevItem =>
              prevItem.link === item.link
                ? { ...prevItem, summary: "AI 요약 실패", tags: [], isProcessing: false }
                : prevItem
            )
          );
        }

        if (!fromCache && i < initialItems.length - 1) {
          await delay(7000);
        }
      }
    } catch (err) {
      setError("뉴스 데이터를 불러오거나 처리하는 데 실패했습니다.");
      console.error("App.jsx fetchAndProcessNews error:", err);
      setLoading(false);
    }
  }, [jobTitle, customKeywords, activeTab]);

  useEffect(() => {
    if (activeTab === 'custom') {
      fetchAndProcessNews();
    }
  }, [fetchAndProcessNews, activeTab]);

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
            {loading && <div className={styles.loading}>뉴스 목록을 불러오는 중입니다...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.newsGrid}>
              {newsItems.length > 0 ? (
                newsItems.map((item, index) =>
                  item.isProcessing ? (
                    <NewsItemSkeleton key={item.link || index} />
                  ) : (
                    <NewsItem key={item.link || index} item={item} onItemClick={openModal} onScrap={handleScrap} />
                  )
                )
              ) : (
                !loading && !error && jobTitle && (
                  <div className={styles.noResults}>입력된 직무와 키워드에 해당하는 뉴스가 없습니다.</div>
                )
              )}
            </div>
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
    <div>
      <div className={styles.app}>
        <header className={styles.header}>
            <div className={styles.themeToggleContainer}>
              <ThemeToggle />
            </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>AI 뉴스 브리핑</h1>
          </div>
          <p className={styles.subtitle}>
            AI 맞춤 분석, 실시간 뉴스, 주요 토픽까지 한눈에
          </p>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className={styles.main}>
          {renderContent()}
        </main>

        <Modal item={selectedNews} onClose={closeModal} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
