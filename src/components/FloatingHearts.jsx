import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./FloatingHearts.css";

function FloatingHearts({ count = 20 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts = [];
      const heartEmojis = ["❤️", "💕", "💗", "💖", "💘", "💝", "💓", "💞"];

      for (let i = 0; i < count; i++) {
        newHearts.push({
          id: i,
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
          left: Math.random() * 100,
          animationDuration: 8 + Math.random() * 12,
          delay: Math.random() * 10,
          size: 15 + Math.random() * 25,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, [count]);

  return (
    <div className="floating-hearts-container">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          initial={{ y: "110vh", rotate: 0 }}
          animate={{
            y: "-10vh",
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: heart.animationDuration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingHearts;
