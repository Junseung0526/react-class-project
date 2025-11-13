import React from 'react';
import styles from './Tag.module.css';

const getTagStyle = (text) => {
  switch (text) {
    case '긴급':
      return styles.urgent;
    case '필수 열람':
      return styles.mustRead;
    case '정책 변경':
    case '법규':
      return styles.policy;
    case '시장 동향':
    case '산업 분석':
      return styles.market;
    case '기술 트렌드':
    case '보안 이슈':
      return styles.tech;
    default:
      return styles.default;
  }
};

const Tag = ({ text }) => {
  const styleClass = getTagStyle(text);

  return (
    <span className={`${styles.tag} ${styleClass}`}>
      {text}
    </span>
  );
};

export default Tag;
