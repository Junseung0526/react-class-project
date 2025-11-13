import { X } from 'lucide-react';
import Tag from './Tag';
import styles from './Modal.module.css';

const Modal = ({ item, onClose }) => {
  if (!item) {
    return null;
  }

  // Decode HTML entities for all content
  const decodedTitle = item.title.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const decodedDescription = item.description.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: decodedTitle }} />

        <div className={styles.tags}>
          {item.tags && item.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>

        <div className={styles.content}>
          <h3>AI 요약</h3>
          <p>{item.summary}</p>

          <h3>원본 내용</h3>
          <p dangerouslySetInnerHTML={{ __html: decodedDescription }} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
