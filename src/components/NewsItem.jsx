import Tag from './Tag';
import styles from './NewsItem.module.css';

const NewsItem = ({ item, onItemClick }) => {
  // Naver API returns title and description with HTML entities
  const decodedTitle = item.title.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  return (
    <div className={styles.card} onClick={() => onItemClick(item)}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <a
            href={item.originallink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent card click from firing when link is clicked
            dangerouslySetInnerHTML={{ __html: decodedTitle }}
          />
        </h2>
        <a
          href={item.originallink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          onClick={(e) => e.stopPropagation()} // Prevent card click from firing when link is clicked
        >
          원문 보기 &rarr;
        </a>
      </div>

      {item.summary && (
        <p className={styles.summary}>
          {item.summary}
        </p>
      )}

      <div className={styles.tags}>
        {item.tags && item.tags.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
      </div>
    </div>
  );
};

export default NewsItem;