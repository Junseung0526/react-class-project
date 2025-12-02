import styles from '../styles/NewsItem.module.css';
import { formatDate, truncateText } from '../utils/helpers';

export default function NewsItem({ item, onItemClick, onScrap }) {
  const summaryText = item.summary || '';
  const truncatedSummary = truncateText(summaryText, 100);

  return (
    <div className={styles.card} onClick={() => onItemClick(item)}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <a
            href={item.originallink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </h2>
        <a
          href={item.originallink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          onClick={(e) => e.stopPropagation()}
        >
          원문 보기 &rarr;
        </a>
      </div>

      <span className={styles.date}>{formatDate(item.pubDate, 'full')}</span>

      {summaryText && (
        <p className={styles.summary}>
          {truncatedSummary}
        </p>
      )}

      <div className={styles.footer}>
        <div className={styles.tags}>
          {item.tags && item.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <button
          className={styles.scrapBtn}
          onClick={(e) => {
            e.stopPropagation();
            onScrap(item);
          }}
        >
          스크랩
        </button>
      </div>
    </div>
  );
};