import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PhotoGallery from "./components/PhotoGallery";
import Timeline from "./components/Timeline";
import Quiz from "./components/Quiz";
import LoveNotebook from "./components/LoveNotebook";
import Messages from "./components/Messages";
import Surprise from "./components/Surprise";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<PhotoGallery />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/notebook" element={<LoveNotebook />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/surprise" element={<Surprise />} />
      </Routes>
    </div>
  );
}

export default App;
