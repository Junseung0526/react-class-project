import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Tag from './Tag';
import styles from '../styles/Input.module.css';

const KeywordInput = ({ keywords, setKeywords, maxKeywords }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newKeyword = inputValue.trim();
      if (!keywords.includes(newKeyword) && keywords.length < maxKeywords) {
        setKeywords([...keywords, newKeyword]);
        setInputValue('');
      }
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  return (
    <div className={styles.keywordInputContainer}>
      <label htmlFor="keyword-input" className={styles.label}>
        뉴스를 필터링할 키워드를 추가하세요 (최대 {maxKeywords}개)
      </label>
      <input
        type="text"
        id="keyword-input"
        className={styles.input}
        placeholder="키워드를 입력하고 Enter를 누르세요"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleAddKeyword}
        disabled={keywords.length >= maxKeywords}
      />
      <div className={styles.tagContainer}>
        {keywords.map((keyword) => (
          <div key={keyword} className={styles.tagWrapper}>
            <Tag text={keyword} />
            <button
              onClick={() => handleRemoveKeyword(keyword)}
              className={styles.removeButton}
              aria-label={`Remove ${keyword}`}
            >
              <XCircle size={14} />
            </button>
          </div>
        ))}
      </div>
      {keywords.length >= maxKeywords && (
        <p className={styles.errorText}>최대 키워드 개수에 도달했습니다.</p>
      )}
    </div>
  );
};

export default KeywordInput;