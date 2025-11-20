// 필요한 컴포넌트와 스타일을 임포트합니다.
import SimpleNewsItem from './SimpleNewsItem';
import styles from '../styles/RealtimeNews.module.css'; // 다른 뷰의 스타일을 재사용합니다.

// 스크랩된 뉴스 목록을 보여주는 뷰 컴포넌트입니다.
export default function ScrappedNewsView({ items, onRemove }) {
  // 스크랩된 아이템이 없으면 메시지를 표시합니다.
  if (!items || items.length === 0) {
    return <div className={styles.noResults}>스크랩한 기사가 없습니다.</div>;
  }

  // 스크랩된 뉴스 목록을 렌더링합니다.
  return (
    <div className={styles.listContainer}>
      <h2 className={styles.viewTitle}>스크랩한 뉴스</h2>
      <div className={styles.newsList}>
        {/* 부모 컴포넌트로부터 받은 'items' 배열을 순회하며 각 뉴스 아이템을 렌더링합니다. */}
        {items.map(item => (
          <SimpleNewsItem
            key={item.originallink} // 각 아이템의 고유 링크를 key로 사용합니다.
            item={item}
            onRemove={() => onRemove(item)} // '제거' 버튼 클릭 시 onRemove 함수를 호출합니다.
          />
        ))}
      </div>
    </div>
  );
};