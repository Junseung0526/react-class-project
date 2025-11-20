/**
 * 네이버 뉴스 API를 호출하여 뉴스 데이터를 가져오는 비동기 함수입니다.
 * @param {string} query - 검색어
 * @param {string} sort - 정렬 옵션 ('sim': 관련도순, 'date': 날짜순)
 * @param {number} start - 검색 시작 위치
 * @param {number} display - 한 번에 표시할 검색 결과 개수
 * @returns {Promise<Array>} - 뉴스 아이템 배열을 반환하는 프로미스. 에러 발생 시 빈 배열을 반환합니다.
 */
export const fetchNewsData = async (query, sort = 'sim', start = 1, display = 100) => {
  // 백엔드에 설정된 프록시 URL을 통해 네이버 뉴스 API에 요청합니다.
  // CORS 문제를 피하기 위해 프록시를 사용합니다.
  let url = `/naver-news-proxy?query=${encodeURIComponent(query)}&sort=${sort}&start=${start}&display=${display}`;

  try {
    const response = await fetch(url);

    // HTTP 응답이 성공적이지 않으면 에러를 발생시킵니다.
    if (!response.ok) {
      // 에러 응답 본문을 JSON으로 파싱하여 더 구체적인 에러 메시지를 얻으려고 시도합니다.
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Naver API error: ${response.status} - ${errorData.errorMessage || errorData.message}`);
    }

    // 응답 본문을 JSON으로 파싱합니다.
    const data = await response.json();
    // 파싱된 데이터에서 뉴스 아이템 배열을 반환합니다.
    return data.items;
  } catch (error) {
    // API 호출 중 발생한 모든 에러를 콘솔에 기록하고,
    // 애플리케이션의 안정성을 위해 빈 배열을 반환합니다.
    console.error("Error fetching news from Naver:", error);
    return [];
  }
};