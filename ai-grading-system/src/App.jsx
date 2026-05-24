import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentReport from "./components/StudentReport";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentReport />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>AI Question Paper Grading System</h1>
            <p className="tagline">
              Automated grading powered by Artificial Intelligence
            </p>
          </motion.div>
        </div>
      </header>

      <main className="home-main">
        <div className="role-selection">
          <motion.div
            className="role-card teacher-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="role-icon">👨‍🏫</div>
            <h2>Teacher</h2>
            <p>
              Create exams, upload answer sheets, and let AI grade them
              automatically
            </p>
            <Link to="/teacher" className="role-btn">
              Go to Teacher Dashboard
            </Link>
          </motion.div>

          <motion.div
            className="role-card student-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="role-icon">👨‍🎓</div>
            <h2>Student</h2>
            <p>View your graded answer sheets and performance analytics</p>
            <Link to="/student" className="role-btn">
              View My Reports
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="features-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">📸</span>
              <h3>Image Upload</h3>
              <p>Upload answer sheets as images</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <h3>OCR Extraction</h3>
              <p>Automatic text extraction from images</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <h3>AI Grading</h3>
              <p>Intelligent answer evaluation</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <h3>Analytics</h3>
              <p>Detailed performance reports</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="home-footer">
        <p>© 2026 AI Grading System. Built with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
