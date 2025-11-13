import styles from '../styles/Navigation.module.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'custom', label: 'AI 맞춤 뉴스' },
    { id: 'realtime', label: '실시간 뉴스' },
    { id: 'top', label: '주요 토픽 뉴스' },
  ];

  return (
    <nav className={styles.nav}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
