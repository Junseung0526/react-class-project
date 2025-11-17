  import styles from '../styles/SimpleNewsItem.module.css';

const SimpleNewsItem = ({ item, onScrap, onRemove }) => {
  const decodedTitle = item.title.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <a
          href={item.originallink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: decodedTitle }}
        />
        <span className={styles.date}>{formatDate(item.pubDate)}</span>
      </div>
      {onScrap && (
        <button onClick={() => onScrap(item)} className={styles.scrapButton}>
          스크랩
        </button>
      )}
      {onRemove && (
        <button onClick={() => onRemove(item)} className={styles.removeButton}>
          삭제
        </button>
      )}
    </div>
  );
};

export default SimpleNewsItem;