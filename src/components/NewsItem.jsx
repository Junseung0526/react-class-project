
import styles from '../styles/NewsItem.module.css';

export default function NewsItem({ item, onItemClick, onScrap }) {
  const decodedTitle = item.title.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const summaryText = item.summary || '';
  const truncatedSummary = summaryText.length > 100
    ? `${summaryText.substring(0, 100)}...`
    : summaryText;

  return (
    <div className={styles.card} onClick={() => onItemClick(item)}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <a
            href={item.originallink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            dangerouslySetInnerHTML={{ __html: decodedTitle }}
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

      <span className={styles.date}>{formatDate(item.pubDate)}</span>

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
          className={styles.scrapButton}
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