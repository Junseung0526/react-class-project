// React 및 관련 훅, 컴포넌트, 유틸리티 함수들을 임포트합니다.
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

// 메인 애플리케이션 컴포넌트입니다.
function App() {
  // --- 상태 관리 ---

  // 맞춤 AI 뉴스 관련 상태
  const [jobTitle, setJobTitle] = useState(''); // 사용자가 입력한 직무
  const [customKeywords, setCustomKeywords] = useState([]); // 사용자가 입력한 추가 키워드
  const [newsItems, setNewsItems] = useState([]); // API로부터 받아온 뉴스 아이템 목록
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [sortOrder, setSortOrder] = useState('sim'); // 뉴스 정렬 순서 (sim: 관련도순, date: 날짜순)

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage] = useState(10); // 페이지 당 아이템 수
  const [hasMoreNews, setHasMoreNews] = useState(true); // 더 불러올 뉴스가 있는지 여부

  // UI 관련 상태
  const [selectedNews, setSelectedNews] = useState(null); // 사용자가 선택한 뉴스 아이템 (모달용)
  const [activeTab, setActiveTab] = useState('custom'); // 현재 활성화된 탭 ('custom', 'realtime', 'top', 'scrapped')

  // 스크랩된 뉴스 관련 상태
  const [scrappedNews, setScrappedNews] = useState([]); // 스크랩된 뉴스 아이템 목록

  // --- 효과 훅 (useEffect) ---

  // 컴포넌트 마운트 시 로컬 스토리지에서 스크랩된 뉴스를 불러옵니다.
  useEffect(() => {
    const savedNews = localStorage.getItem('scrapped_news');
    if (savedNews) {
      setScrappedNews(JSON.parse(savedNews));
    }
  }, []);

  // 직무나 정렬 순서가 변경되면 기존 뉴스 목록을 초기화합니다.
  useEffect(() => {
    setNewsItems([]);
    setCurrentPage(1);
    setHasMoreNews(true);
  }, [jobTitle, sortOrder]);

  // 직무, 키워드, 정렬 순서, 현재 페이지, 또는 활성 탭이 변경될 때 뉴스를 가져옵니다.
  useEffect(() => {
    // 'custom' 탭이 아니거나 직무가 입력되지 않았으면 뉴스 요청을 하지 않습니다.
    if (!jobTitle || activeTab !== 'custom') {
      setNewsItems([]);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // 검색 쿼리를 생성합니다 (직무 + 커스텀 키워드 + 기본 키워드).
        const query = [jobTitle, ...customKeywords, ...DEFAULT_KEYWORDS].join(' ');
        const start = (currentPage - 1) * itemsPerPage + 1; // API 요청 시작점 계산
        const fetchedNews = await fetchNewsData(query, sortOrder, start, itemsPerPage);

        // 가져온 뉴스 데이터를 화면에 맞게 가공합니다.
        const processedItems = fetchedNews.map(item => ({
          ...item,
          summary: item.description.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<b>/g, '').replace(/<\/b>/g, ''),
          tags: [],
          isProcessing: false
        }));
        
        // 뉴스 아이템 상태를 업데이트합니다. 중복된 뉴스는 제거합니다.
        setNewsItems(prevItems => {
          const allItems = currentPage === 1 ? processedItems : [...prevItems, ...processedItems];
          const uniqueItems = Array.from(new Map(allItems.map(item => [item.originallink, item])).values());
          return uniqueItems;
        });
        
        // 더 불러올 뉴스가 있는지 확인합니다.
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

  // --- 핸들러 함수 ---

  // 뉴스 스크랩 처리 함수
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

  // 스크랩 제거 처리 함수
  const handleRemoveScrap = (itemToRemove) => {
    const updatedScrappedNews = scrappedNews.filter(item => item.originallink !== itemToRemove.originallink);
    setScrappedNews(updatedScrappedNews);
    localStorage.setItem('scrapped_news', JSON.stringify(updatedScrappedNews));
  };

  // 직무 입력 폼 제출 처리 함수
  const handleJobSubmit = useCallback((newJobTitle) => {
    setJobTitle(newJobTitle);
    setCustomKeywords([]); // 직무가 바뀌면 커스텀 키워드는 초기화
  }, []);

  // 뉴스 아이템 클릭 시 모달을 여는 함수
  const openModal = (item) => {
    if (item.isProcessing) return; // 처리 중인 아이템은 모달을 열지 않음
    setSelectedNews(item);
  };
  
  // 모달을 닫는 함수
  const closeModal = () => {
    setSelectedNews(null);
  };
  
  // '더 많은 뉴스 보기' 버튼 클릭 처리 함수
  const handleLoadMore = () => {
    if (!loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // --- 렌더링 로직 ---

  // 활성 탭에 따라 다른 컨텐츠를 렌더링하는 함수
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

            {/* 로딩 및 에러 상태에 따른 UI 렌더링 */}
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
            {/* '더 보기' 버튼 렌더링 조건 */}
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
  
  // 최종 JSX를 반환합니다.
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

        {/* 네비게이션 탭 */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className={styles.main}>
          {renderContent()}
        </main>
        
        {/* 뉴스 상세 정보 모달 */}
        <Modal item={selectedNews} onClose={closeModal} keywords={[jobTitle, ...customKeywords].filter(Boolean)} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
