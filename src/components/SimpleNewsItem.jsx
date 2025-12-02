import styles from '../styles/SimpleNewsItem.module.css';
import { formatDate } from '../utils/helpers';

export default function SimpleNewsItem({ item, onScrap, onRemove }) {
  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <a
          href={item.originallink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <span className={styles.date}>{formatDate(item.pubDate, 'short')}</span>
      </div>
      {onScrap && (
        <button onClick={() => onScrap(item)} className={styles.scrapBtn}>
          스크랩
        </button>
      )}
      {onRemove && (
        <button onClick={() => onRemove(item)} className={styles.removeBtn}>
          삭제
        </button>
      )}
    </div>
  );
};