const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;

const GEMINI_MODEL = "gemini-2.5-pro";
const GEMINI_API_URL = 
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


function App() {

  return (
    <div className="App">

    </div>
  )
}

export default App