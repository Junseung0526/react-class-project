export const fetchNewsData = async (query, sort = 'sim', start = 1, display = 100) => {
  const baseUrl = 'https://openapi.naver.com/v1/search/news.json';
  const proxyUrl = 'https://proxy.cors.sh/';
  const fullUrl = `${proxyUrl}${baseUrl}?query=${encodeURIComponent(query)}&sort=${sort}&start=${start}&display=${display}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': import.meta.env.VITE_NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_CLIENT_SECRET,
      },
    });

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