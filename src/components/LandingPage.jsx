import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "./FloatingHearts";
import MusicPlayer from "./MusicPlayer";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [showEnterButton, setShowEnterButton] = useState(false);

  useEffect(() => {
    // Show enter button after a short delay for dramatic effect
    const timer = setTimeout(() => setShowEnterButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="landing-page">
      <FloatingHearts count={30} />
      <MusicPlayer />

      <motion.div
        className="landing-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="main-title-container" variants={itemVariants}>
          <motion.div
            className="heart-icon-large"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ❤️
          </motion.div>
          <h1 className="main-title">I Love You Astha</h1>
        </motion.div>

        <motion.p className="subtitle" variants={itemVariants}>
          Our Journey Started on 15th February 2026
        </motion.p>

        <motion.div className="love-counter" variants={itemVariants}>
          <div className="counter-card glass-card">
            <div className="counter-label">Days Together</div>
            <div className="counter-value">
              <LoveCounter startDate="2026-02-15" />
            </div>
            <div className="counter-heart">💕</div>
          </div>
        </motion.div>

        <motion.div className="poem-section" variants={itemVariants}>
          <div className="poem glass-card">
            <p>
              In your eyes, I found my home,
              <br />
              In your heart, I found my love.
              <br />
              Together forever, never alone,
              <br />
              Two souls, perfectly made above.
            </p>
          </div>
        </motion.div>

        {showEnterButton && (
          <motion.button
            className="enter-button btn-romantic"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/gallery")}
          >
            Enter Our Love Story ✨
          </motion.button>
        )}

        <motion.div className="scroll-indicator" variants={itemVariants}>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p>Scroll to explore</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Component to count days together
function LoveCounter({ startDate }) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now - start;
      const daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDays(daysCount >= 0 ? daysCount : 0);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [startDate]);

  return <span>{days}</span>;
}

export default LandingPage;
