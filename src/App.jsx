import { useState, useEffect, useCallback } from 'react';
import JobInput from './components/JobInput';
import KeywordInput from './components/KeywordInput';
import NewsItem from './components/NewsItem';
import Modal from './components/Modal';
import NewsItemSkeleton from './components/NewsItemSkeleton'; // Import Skeleton
import { DEFAULT_KEYWORDS, MAX_CUSTOM_KEYWORDS } from './utils/constants';
import { fetchNewsData, summarizeAndTag } from './utils/api';
import styles from './App.module.css';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleJobSubmit = useCallback((newJobTitle) => {
    setJobTitle(newJobTitle);
    setCustomKeywords([]);
  }, []);

  const openModal = (item) => {
    // Don't open modal for items that are still processing
    if (item.isProcessing) return;
    setSelectedNews(item);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  const fetchAndProcessNews = useCallback(async () => {
    if (!jobTitle) {
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
      console.log("--- DEBUG: Fetched News (Before De-duplication) ---");
      console.log(`Count: ${fetchedNews.length}`, fetchedNews);

      // Filter out duplicate news articles based on the original link
      const uniqueNews = Array.from(new Map(fetchedNews.map(item => [item.originallink, item])).values());
      console.log("--- DEBUG: Unique News (After De-duplication) ---");
      console.log(`Count: ${uniqueNews.length}`, uniqueNews);
      
      const persona = `당신은 ${jobTitle} 전문가입니다. 기사를 ${jobTitle}의 관점에서 분석하고 요약해주세요.`;

      // Set all items as processing initially to show skeletons
      const initialItems = uniqueNews.map(item => ({ ...item, isProcessing: true, summary: '', tags: [] }));
      setNewsItems(initialItems);
      setLoading(false); // Skeletons are visible, so main loading text can be hidden

      // Process items sequentially
      for (let i = 0; i < initialItems.length; i++) {
        const item = initialItems[i];
        try {
          const { summary, tags } = await summarizeAndTag(item.description, persona);
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
        
        // Wait only if it's not the last item
        if (i < initialItems.length - 1) {
          await delay(7000);
        }
      }
    } catch (err) {
      setError("뉴스 데이터를 불러오거나 처리하는 데 실패했습니다.");
      console.error("App.jsx fetchAndProcessNews error:", err);
      setLoading(false);
    }
  }, [jobTitle, customKeywords]);

  useEffect(() => {
    fetchAndProcessNews();
  }, [fetchAndProcessNews]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          직군 맞춤형 AI 뉴스 브리핑
        </h1>
        <p className={styles.subtitle}>
          원하는 직무와 키워드에 맞춰 AI가 분석한 뉴스를 받아보세요.
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.inputSection}>
          <JobInput
            onJobSubmit={handleJobSubmit}
            initialJob={jobTitle}
          />
          {jobTitle && (
            <KeywordInput
              keywords={customKeywords}
              setKeywords={setCustomKeywords}
              maxKeywords={MAX_CUSTOM_KEYWORDS}
            />
          )}
        </div>

        {loading && (
          <div className={styles.loading}>
            뉴스 목록을 불러오는 중입니다...
          </div>
        )}
        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <div className={styles.newsGrid}>
          {newsItems.length > 0 ? (
            newsItems.map((item, index) => 
              item.isProcessing ? (
                <NewsItemSkeleton key={item.link || index} />
              ) : (
                <NewsItem key={item.link || index} item={item} onItemClick={openModal} />
              )
            )
          ) : (
            !loading && !error && jobTitle && (
              <div className={styles.noResults}>
                입력된 직무와 키워드에 해당하는 뉴스가 없습니다.
              </div>
            )
          )}
        </div>
      </main>

      <Modal item={selectedNews} onClose={closeModal} />
    </div>
  );
}

export default App;