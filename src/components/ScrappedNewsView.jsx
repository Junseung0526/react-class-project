import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/RealtimeNews.module.css'; // Can reuse styles

const ScrappedNewsView = ({ items, onRemove }) => {
  if (!items || items.length === 0) {
    return <div className={styles.noResults}>스크랩한 기사가 없습니다.</div>;
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.viewTitle}>스크랩한 뉴스</h2>
      <div className={styles.newsList}>
        {items.map(item => (
          <SimpleNewsItem
            key={item.originallink}
            item={item}
            onRemove={() => onRemove(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrappedNewsView;
