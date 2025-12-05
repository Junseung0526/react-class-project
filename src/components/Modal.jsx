import { X, Link, Twitter } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import styles from '../styles/Modal.module.css';

export default function Modal({ item, onClose, keywords = [] }) {
  if (!item) {
    return null;
  }

  const highlightKeywords = (text, keywordsToHighlight) => {
    if (!keywordsToHighlight.length || !text) {
      return text;
    }
    const regex = new RegExp(`(${keywordsToHighlight.join('|')})`, 'gi');
    return text.replace(regex, (match) => `<mark class="${styles.highlight}">${match}</mark>`);
  };

  const highlightedTitle = highlightKeywords(item.title, keywords);
  const highlightedDescription = highlightKeywords(item.summary, keywords);

  const pubDate = item.pubDate ? formatDate(item.pubDate, 'locale') : '날짜 정보 없음';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.originallink);
      alert('기사 링크가 복사되었습니다.');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(item.originallink)}&text=${encodeURIComponent(item.title)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
        <div className={styles.meta}>
          <span className={styles.press}>{item.press}</span>
          <span className={styles.date}>{pubDate}</span>
        </div>

        <div className={styles.tags}>
          {item.tags && item.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.content}>
          <h3>기사 내용</h3>
          <p dangerouslySetInnerHTML={{ __html: highlightedDescription }} />
        </div>

        <div className={styles.footer}>
          <div className={styles.shareButtons}>
            <button onClick={handleCopyLink} className={styles.shareButton} title="링크 복사">
              <Link size={20} />
            </button>
            <button onClick={handleShareTwitter} className={styles.shareButton} title="트위터에 공유">
              <Twitter size={20} />
            </button>
          </div>
          {item.originallink && (
            <a href={item.originallink} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
              원본 기사 보기
            </a>
          )}
        </div>
      </div>
    </div>
  );
};