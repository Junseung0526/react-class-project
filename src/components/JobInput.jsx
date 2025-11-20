import { useState } from 'react';
import styles from '../styles/Input.module.css';

export default function JobInput({ onJobSubmit, initialJob }) {
  const [jobInputValue, setJobInputValue] = useState(initialJob || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobInputValue.trim()) {
      onJobSubmit(jobInputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="job-input" className={styles.label}>
        어떤 직무의 뉴스를 확인하고 싶으신가요?
      </label>
      <input
        id="job-input"
        type="text"
        className={styles.input}
        value={jobInputValue}
        onChange={(e) => setJobInputValue(e.target.value)}
        placeholder="예: 프론트엔드 개발자, 데이터 분석가..."
      />
    </form>
  );
};