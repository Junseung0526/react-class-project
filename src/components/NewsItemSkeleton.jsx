import styles from './NewsItemSkeleton.module.css';

const Shimmer = () => (
  <div className={styles.shimmerWrapper}>
    <div className={styles.shimmer}></div>
  </div>
);

const NewsItemSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.line} ${styles.shimmerWrapper}`}>
        <div className={styles.shimmer}></div>
      </div>
      <div className={`${styles.lineShort} ${styles.shimmerWrapper}`}>
        <div className={styles.shimmer}></div>
      </div>
      <div style={{ height: '3rem', marginTop: '1.5rem' }}>
        <div className={`${styles.lineMedium} ${styles.shimmerWrapper}`}>
          <div className={styles.shimmer}></div>
        </div>
        <div className={`${styles.lineLong} ${styles.shimmerWrapper}`}>
          <div className={styles.shimmer}></div>
        </div>
        <div className={`${styles.lineMedium} ${styles.shimmerWrapper}`}>
          <div className={styles.shimmer}></div>
        </div>
      </div>
    </div>
  );
};

export default NewsItemSkeleton;
