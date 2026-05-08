import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Surprise.css";

// Romantic surprise messages
const surpriseMessages = [
  "You are the most beautiful soul I've ever met. I love you more than words can say! ❤️",
  "Every moment with you feels like a beautiful dream. Thank you for being mine! 💕",
  "Your smile lights up my world brighter than a thousand suns! 🌟",
  "I fall in love with you more and more each day. You're my everything! 💖",
  "You are my today and all of my tomorrows. I love you endlessly! 💗",
  "In your arms is my favorite place to be. You're my home! 🏠❤️",
  "You make my heart skip a beat every single time I see you! 💓",
  "I'm so grateful for you. You're the best thing that ever happened to me! 🙏💕",
  "Your love is the greatest gift I've ever received! 🎁❤️",
  "I promise to love you forever, through all of life's adventures! 🌈",
  "You are my sunshine on a rainy day, my warmth in the cold! ☀️",
  "I love you to the moon and back, over and over again! 🌙⭐",
  "You complete me in ways I never knew I needed! 💞",
  "My love for you grows stronger with every passing day! 🌹",
  "You are my happily ever after! 👑💕",
];

// Surprise animations/visuals
const surpriseVisuals = [
  "🌹🌹🌹",
  "💕💕💕",
  "✨✨✨",
  "💖💖💖",
  "🎉🎉🎉",
  "💗💗💗",
  "🦋🦋🦋",
  "⭐⭐⭐",
];

function Surprise() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentVisual, setCurrentVisual] = useState("");
  const [confetti, setConfetti] = useState([]);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    const randomMessage =
      surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    const randomVisual =
      surpriseVisuals[Math.floor(Math.random() * surpriseVisuals.length)];

    setCurrentMessage(randomMessage);
    setCurrentVisual(randomVisual);
    setShowSurprise(true);

    // Generate confetti
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ["#e91e63", "#7b1fa2", "#f48fb1", "#ce93d8", "#ffc107", "#ff5722"][
        Math.floor(Math.random() * 6)
      ],
      size: 8 + Math.random() * 12,
    }));
    setConfetti(newConfetti);

    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  const specialSurprise = () => {
    // After multiple clicks, show something extra special
    return clickCount >= 5;
  };

  return (
    <div className="surprise-page">
      <div className="surprise-container">
        <motion.div
          className="surprise-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Special Surprise 🎁</h1>
          <p>Click the button for a special message from my heart!</p>
        </motion.div>

        <div className="surprise-box">
          <motion.button
            className="surprise-button"
            onClick={handleClick}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(233, 30, 99, 0.5)",
                "0 0 40px rgba(233, 30, 99, 0.8)",
                "0 0 20px rgba(233, 30, 99, 0.5)",
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
              },
            }}
          >
            <span className="button-text">
              {clickCount === 0 ? "Click for Surprise!" : "Click Again!"}
            </span>
            <span className="button-emoji">🎁</span>
          </motion.button>

          {clickCount > 0 && (
            <p className="click-counter">Surprises received: {clickCount} 💕</p>
          )}
        </div>

        <AnimatePresence>
          {showSurprise && (
            <motion.div
              className="surprise-content"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <div className="surprise-visual">{currentVisual}</div>
              <motion.div
                className="surprise-message glass-card"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>{currentMessage}</p>
              </motion.div>

              {specialSurprise() && (
                <motion.div
                  className="special-surprise"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="special-badge">🌟 Special!</div>
                  <p>
                    You've unlocked a bonus! I love you more than all the stars
                    in the sky! Keep clicking for more surprises! 💫
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti */}
        <div className="confetti-container">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
              }}
              initial={{ y: -20, rotate: 0, opacity: 1 }}
              animate={{
                y: "100vh",
                rotate: 720,
                opacity: 0,
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Additional Surprise Section */}
        <motion.div
          className="extra-surprises"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3>More Ways I Love You</h3>
          <div className="love-cards">
            <motion.div
              className="love-card"
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              <span className="card-emoji">💌</span>
              <p>Love Letters</p>
              <small>Written just for you</small>
            </motion.div>
            <motion.div
              className="love-card"
              whileHover={{ scale: 1.05, rotate: 3 }}
            >
              <span className="card-emoji">📸</span>
              <p>Memories</p>
              <small>Our beautiful moments</small>
            </motion.div>
            <motion.div
              className="love-card"
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              <span className="card-emoji">🌹</span>
              <p>Romantic Dates</p>
              <small>Planned with love</small>
            </motion.div>
            <motion.div
              className="love-card"
              whileHover={{ scale: 1.05, rotate: 3 }}
            >
              <span className="card-emoji">💍</span>
              <p>Forever</p>
              <small>My promise to you</small>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Surprise;
