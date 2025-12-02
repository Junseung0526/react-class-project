import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utils/api';
import { cleanHtml } from '../utils/helpers';
import { DEFAULT_KEYWORDS } from '../utils/constants';

const ITEMS_PER_PAGE = 10;

export const useNewsData = (jobTitle, customKeywords, sortOrder, activeTab) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreNews, setHasMoreNews] = useState(true);

  useEffect(() => {
    setNewsItems([]);
    setCurrentPage(1);
    setHasMoreNews(true);
  }, [jobTitle, sortOrder]);

  useEffect(() => {
    if (!jobTitle || activeTab !== 'custom') {
      setNewsItems([]);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = [jobTitle, ...customKeywords, ...DEFAULT_KEYWORDS].join(' ');
        const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const fetchedNews = await fetchNewsData(query, sortOrder, start, ITEMS_PER_PAGE);

        const processedItems = fetchedNews.map(item => ({
          ...item,
          title: cleanHtml(item.title),
          summary: cleanHtml(item.description),
          tags: []
        }));

        setNewsItems(prevItems => {
          const allItems = currentPage === 1 ? processedItems : [...prevItems, ...processedItems];
          const uniqueItems = Array.from(new Map(allItems.map(item => [item.originallink, item])).values());
          return uniqueItems;
        });

        setHasMoreNews(processedItems.length === ITEMS_PER_PAGE);
      } catch (err) {
        setError("뉴스 데이터를 불러오거나 처리하는 데 실패했습니다.");
        console.error("useNewsData fetchNews error:", err);
        setHasMoreNews(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [jobTitle, customKeywords, sortOrder, currentPage, activeTab]);

  const handleLoadMore = () => {
    if (!loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return { newsItems, loading, error, hasMoreNews, handleLoadMore };
};