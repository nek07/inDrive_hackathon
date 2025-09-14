// App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import AnalysisResults from "./pages/AnalysisResults";
import ResultsPage from "./pages/ResultsPage";
export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/">Главная</Link>
        <Link to="/upload">Загрузка фото</Link>
      </nav>

      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analysis" element={<AnalysisResults />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
