import Tag from './Tag';
import styles from '../styles/NewsItem.module.css';

const NewsItem = ({ item, onItemClick, onScrap }) => {
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

      {item.summary && (
        <p className={styles.summary}>
          {item.summary}
        </p>
      )}

      <div className={styles.footer}>
        <div className={styles.tags}>
          {item.tags && item.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
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

export default NewsItem;