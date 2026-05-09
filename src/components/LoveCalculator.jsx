import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoveCalculator.css";

function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [hearts, setHearts] = useState([]);

  const loveMessages = [
    "You two are soulmates! Made for each other! 💕",
    "Your love is written in the stars! ✨",
    "A perfect match! Keep the love alive! 🔥",
    "Your connection is magical and pure! 💝",
    "True love exists and you found it! 💑",
    "Your love story is absolutely beautiful! 📖",
    "You complete each other perfectly! 🧩",
    "Your love is stronger than ever! 💪",
    "Destiny brought you two together! 🌟",
    "Your love is a fairytale come true! 🏰",
  ];

  const calculateLove = () => {
    if (!name1.trim() || !name2.trim()) return;

    setCalculating(true);
    setResult(null);

    // Create floating hearts animation
    const newHearts = [];
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 20 + Math.random() * 30,
      });
    }
    setHearts(newHearts);

    // Calculate love percentage based on names using a fun algorithm
    // The percentage is determined by the letters in both names combined
    // Same names will always give the same result (consistent!)
    setTimeout(() => {
      const combinedNames = (name1 + name2).toLowerCase().replace(/\s/g, "");

      // Use a hash-based algorithm for consistent results
      let hash = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        hash = combinedNames.charCodeAt(i) + ((hash << 5) - hash);
      }
      const percentage = Math.abs(hash % 101); // 0-100

      // Calculate compatibility factors for fun explanation
      const letterMatch = combinedNames
        .split("")
        .filter((c, i, arr) => arr.indexOf(c) !== i).length;
      const vowelCount = combinedNames
        .split("")
        .filter((c) => "aeiou".includes(c)).length;

      setResult({
        percentage,
        message: loveMessages[Math.floor(Math.random() * loveMessages.length)],
        letterMatch,
        vowelCount,
        totalLetters: combinedNames.length,
      });
      setCalculating(false);
    }, 2000);
  };

  const resetCalculator = () => {
    setName1("");
    setName2("");
    setResult(null);
    setHearts([]);
  };

  const getLoveLevel = (percentage) => {
    if (percentage >= 90)
      return { label: "Ultimate Love", emoji: "🔥", color: "#ff0000" };
    if (percentage >= 75)
      return { label: "Deep Love", emoji: "💕", color: "#e91e63" };
    if (percentage >= 50)
      return { label: "Growing Love", emoji: "💝", color: "#9c27b0" };
    if (percentage >= 25)
      return { label: "Spark", emoji: "💗", color: "#2196f3" };
    return { label: "Friendship", emoji: "💛", color: "#ffeb3b" };
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>💕 Love Calculator 💕</h1>
          <p className="calculator-subtitle">
            Discover the strength of your love connection!
          </p>

          <div className="input-group">
            <div className="name-input">
              <label>Your Name</label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
              />
            </div>

            <div className="heart-divider">❤️</div>

            <div className="name-input">
              <label>Astha's Name</label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Enter Astha's name"
                maxLength={30}
              />
            </div>
          </div>

          <motion.button
            className="calculate-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculateLove}
            disabled={!name1.trim() || !name2.trim() || calculating}
          >
            {calculating ? "Calculating..." : "Calculate Love 💕"}
          </motion.button>

          {/* Floating Hearts Animation */}
          <AnimatePresence>
            {calculating && (
              <div className="floating-hearts">
                {hearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    className="floating-heart"
                    initial={{ y: 100, opacity: 0, scale: 0 }}
                    animate={{
                      y: -200,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: heart.duration,
                      delay: heart.delay,
                      ease: "easeOut",
                    }}
                    style={{
                      left: `${heart.left}%`,
                      fontSize: `${heart.size}px`,
                    }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="result-display"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <div className="result-percentage">
                  <span className="percentage-number">
                    {result.percentage}%
                  </span>
                </div>

                <div className="result-love-level">
                  <span className="love-emoji">
                    {getLoveLevel(result.percentage).emoji}
                  </span>
                  <span className="love-label">
                    {getLoveLevel(result.percentage).label}
                  </span>
                </div>

                <div className="result-names">
                  {name1} <span className="ampersand">&</span> {name2}
                </div>

                <p className="result-message">{result.message}</p>

                {/* Calculation Details */}
                <div className="calculation-details">
                  <h4>🔍 How We Calculated:</h4>
                  <ul>
                    <li>
                      Total letters analyzed:{" "}
                      <strong>{result.totalLetters}</strong>
                    </li>
                    <li>
                      Matching letters in names:{" "}
                      <strong>{result.letterMatch}</strong>
                    </li>
                    <li>
                      Vowels (love letters):{" "}
                      <strong>{result.vowelCount}</strong>
                    </li>
                    <li>
                      Name hash value:{" "}
                      <strong>
                        {Math.abs(
                          (name1 + name2)
                            .split("")
                            .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000,
                        )}
                      </strong>
                    </li>
                  </ul>
                  <p className="calc-note">
                    💡 The percentage is calculated using a special algorithm
                    based on the letters in both names. Same names will always
                    give the same result!
                  </p>
                </div>

                <motion.button
                  className="reset-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetCalculator}
                >
                  Try Again 🔄
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fun Facts Section */}
          <div className="fun-facts">
            <h3>💡 Fun Love Facts</h3>
            <ul>
              <li>❤️ The heart beats about 100,000 times a day</li>
              <li>🧠 Being in love releases dopamine and oxytocin</li>
              <li>🌹 Roses are the most romantic flowers</li>
              <li>💌 February 14th is Valentine's Day worldwide</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoveCalculator;
