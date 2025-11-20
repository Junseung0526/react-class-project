export const fetchNewsData = async (query, sort = 'sim', start = 1, display = 100) => {
  let url = `/naver-news-proxy?query=${encodeURIComponent(query)}&sort=${sort}&start=${start}&display=${display}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Naver API error: ${response.status} - ${errorData.errorMessage || errorData.message}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching news from Naver:", error);
    return [];
  }
};