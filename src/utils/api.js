import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchNewsData = async (query, sort = 'sim') => {
    let url = `/naver-news-proxy?query=${encodeURIComponent(query)}&sort=${sort}`;

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

export const summarizeAndTag = async (item, persona) => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is not set in environment variables.");
    return { summary: "AI 요약을 불러올 수 없습니다.", tags: [], fromCache: false };
  }

  const cacheKey = `summary_${item.originallink}`;
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log("Found cached summary for:", item.originallink);
      return { ...JSON.parse(cachedData), fromCache: true };
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Corrected model name

  const prompt = `${persona} 다음 기사를 분석하여 3문장 이내로 요약하고, 기사의 중요도 및 주제를 나타내는 태그를 5개 이내로 JSON 형식으로 생성해줘. 태그는 ["긴급", "필수 열람", "심화", "시장 동향", "정책 변경", "기술 트렌드", "경영 전략", "산업 분석", "보안 이슈", "법규"] 중에서 선택하고, 기사에 적합한 새로운 태그도 추가할 수 있어.
  
  기사 내용:
  ${item.description}
  
  응답 형식:
  {
    "summary": "여기에 요약 내용",
    "tags": ["태그1", "태그2", "태그3"]
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let parsedData;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      parsedData = JSON.parse(text);
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(parsedData));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    return { ...parsedData, fromCache: false };

  } catch (error) {
    console.error("Error summarizing and tagging with Gemini API:", error);
    console.error("Failed on article content:", item.description);
    console.error("Gemini API Error details:", error.message);
    return { summary: "AI 요약을 불러올 수 없습니다. (API 실패)", tags: [], fromCache: false };
  }
};