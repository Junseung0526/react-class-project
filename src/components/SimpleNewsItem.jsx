import styles from '../styles/RealtimeNews.module.css';

const SimpleNewsItem = ({ item }) => {
  const decodedTitle = item.title.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.item}>
      <a href={item.originallink} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
        <span dangerouslySetInnerHTML={{ __html: decodedTitle }} />
        <div className={styles.itemMeta}>
          {formatDate(item.pubDate)}
        </div>
      </a>
    </div>
  );
};

export default SimpleNewsItem;
