import JobInput from './JobInput';
import KeywordInput from './KeywordInput';
import NewsItem from './NewsItem';
import { MAX_CUSTOM_KEYWORDS } from '../utils/constants';
import styles from '../styles/App.module.css';

export default function CustomNewsView({
  jobTitle,
  onJobSubmit,
  customKeywords,
  setCustomKeywords,
  sortOrder,
  setSortOrder,
  newsItems,
  loading,
  error,
  hasMoreNews,
  handleLoadMore,
  openModal,
  handleScrap,
}) {
  return (
    <div>
      <div className={styles.inputGroup}>
        <JobInput onJobSubmit={onJobSubmit} initialJob={jobTitle} />
        {jobTitle && (
          <KeywordInput keywords={customKeywords} setKeywords={setCustomKeywords} maxKeywords={MAX_CUSTOM_KEYWORDS} />
        )}
      </div>

      {jobTitle && (
        <div className={styles.sortOptions}>
          <button
            className={`${styles.sortButton} ${sortOrder === 'sim' ? styles.active : ''}`}
            onClick={() => setSortOrder('sim')}>
            관련도순
          </button>
          <button
            className={`${styles.sortButton} ${sortOrder === 'date' ? styles.active : ''}`}
            onClick={() => setSortOrder('date')}>
            날짜순
          </button>
        </div>
      )}

      {loading && newsItems.length === 0 && <div className={styles.loading}>뉴스 목록을 불러오는 중입니다...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.newsList}>
        {newsItems.map((item) =>
          <NewsItem key={item.originallink} item={item} onItemClick={openModal} onScrap={handleScrap} />
        )}
      </div>
      {hasMoreNews && !loading && newsItems.length > 0 && (
        <div className={styles.loadMoreWrapper}>
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
    </div>
  );
}