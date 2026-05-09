import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./VirtualLove.css";

function VirtualLove() {
  const [hugs, setHugs] = useState(0);
  const [kisses, setKisses] = useState(0);
  const [showAnimation, setShowAnimation] = useState(null);
  const [message, setMessage] = useState("");

  const loveMessages = [
    "Sending you the biggest virtual hug! 🤗",
    "You're so lucky to have each other! 💕",
    "Awww, that's so sweet! 💝",
    "Your love is beautiful! ✨",
    "Keep spreading the love! 💕",
    "You two are perfect for each other! 💑",
    "Love is in the air! 💘",
    "That's the sweetest thing ever! 🥰",
    "You're making Astha smile! 😊",
    "Your love story is magical! 🌟",
  ];

  const handleHug = () => {
    setHugs(hugs + 1);
    setShowAnimation("hug");
    setMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
    setTimeout(() => setShowAnimation(null), 2000);
  };

  const handleKiss = () => {
    setKisses(kisses + 1);
    setShowAnimation("kiss");
    setMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
    setTimeout(() => setShowAnimation(null), 2000);
  };

  return (
    <div className="virtual-love-container">
      <motion.div
        className="love-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Send Some Virtual Love 💕</h2>
        <p className="love-subtitle">Click to send hugs and kisses to Astha!</p>

        <div className="love-buttons">
          <motion.button
            className="love-btn hug-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHug}
          >
            <span className="btn-icon">🤗</span>
            <span className="btn-text">Send Hug</span>
            <span className="btn-count">{hugs}</span>
          </motion.button>

          <motion.button
            className="love-btn kiss-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleKiss}
          >
            <span className="btn-icon">😘</span>
            <span className="btn-text">Send Kiss</span>
            <span className="btn-count">{kisses}</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="love-animation"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5, y: -100 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 1.5 }}
            >
              {showAnimation === "hug" ? (
                <span className="animation-icon">🤗💕</span>
              ) : (
                <span className="animation-icon">😘💋</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.div
              className="love-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="love-stats">
          <div className="stat">
            <span className="stat-number">{hugs}</span>
            <span className="stat-label">Hugs Sent</span>
          </div>
          <div className="stat-divider">❤️</div>
          <div className="stat">
            <span className="stat-number">{kisses}</span>
            <span className="stat-label">Kisses Sent</span>
          </div>
        </div>

        <div className="total-love">
          <span className="total-label">Total Love Sent:</span>
          <span className="total-number">{hugs + kisses}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default VirtualLove;
