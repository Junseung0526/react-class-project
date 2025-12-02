import { useState, useEffect } from 'react';

export const useScrappedNews = () => {
  const [scrappedNews, setScrappedNews] = useState([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('scrapped_news');
    if (savedNews) {
      setScrappedNews(JSON.parse(savedNews));
    }
  }, []);

  const handleScrap = (itemToScrap) => {
    if (scrappedNews.some(item => item.originallink === itemToScrap.originallink)) {
      alert('이미 스크랩한 기사입니다.');
      return;
    }
    const updatedScrappedNews = [...scrappedNews, itemToScrap];
    setScrappedNews(updatedScrappedNews);
    localStorage.setItem('scrapped_news', JSON.stringify(updatedScrappedNews));
    alert('기사를 스크랩했습니다.');
  };

  const handleRemoveScrap = (itemToRemove) => {
    const updatedScrappedNews = scrappedNews.filter(item => item.originallink !== itemToRemove.originallink);
    setScrappedNews(updatedScrappedNews);
    localStorage.setItem('scrapped_news', JSON.stringify(updatedScrappedNews));
  };

  return { scrappedNews, handleScrap, handleRemoveScrap };
};