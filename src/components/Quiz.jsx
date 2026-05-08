import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Quiz.css";

// Quiz questions - Customize these with your own questions
const quizQuestions = [
  {
    id: 1,
    question: "When did we first meet?",
    options: [
      "January 1, 2026",
      "February 15, 2026",
      "March 1, 2026",
      "April 1, 2026",
    ],
    correctAnswer: 1,
    explanation:
      "We first met on February 15, 2026 - the day that changed everything! 💕",
  },
  {
    id: 2,
    question: "What is my favorite thing about you?",
    options: [
      "Your smile",
      "Your eyes",
      "Your kindness",
      "Everything about you",
    ],
    correctAnswer: 3,
    explanation:
      "It's everything about you - your smile, your eyes, your kindness, everything! ❤️",
  },
  {
    id: 3,
    question: "Where was our first date?",
    options: ["Coffee shop", "Park", "Beach", "Restaurant"],
    correctAnswer: 0,
    explanation:
      "We went to that cozy coffee shop where we talked for hours! ☕",
  },
  {
    id: 4,
    question: "What song reminds me of you?",
    options: [
      "Perfect - Ed Sheeran",
      "All of Me - John Legend",
      "Thinking Out Loud",
      "Can't Help Falling in Love",
    ],
    correctAnswer: 1,
    explanation: "All of Me by John Legend - because I love all of you! 🎵",
  },
  {
    id: 5,
    question: "How long have we been together?",
    options: ["A few weeks", "A few months", "Forever", "Not long enough"],
    correctAnswer: 2,
    explanation:
      "It feels like forever because my heart has always known you! 💘",
  },
  {
    id: 6,
    question: "What do I call you?",
    options: ["Baby", "Mera Bacha", "Love", "Sweetheart"],
    correctAnswer: 1,
    explanation: "You're my Bacha - my life, my everything! 💕",
  },
  {
    id: 7,
    question: "What's our favorite activity together?",
    options: [
      "Watching movies",
      "Going for walks",
      "Talking endlessly",
      "Everything together",
    ],
    correctAnswer: 3,
    explanation: "Everything is better when we're together! 🌟",
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerClick = (index) => {
    if (showExplanation) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <QuizResult
            score={score}
            total={quizQuestions.length}
            restartQuiz={restartQuiz}
          />
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <motion.div
          className="quiz-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Love Quiz 💕</h1>
          <p>How well do you know our love story?</p>
        </motion.div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="quiz-card glass-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="question-number">Q{currentQuestion + 1}</div>
            <h2 className="question-text">{question.question}</h2>

            <div className="options-grid">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`option-btn ${
                    selectedAnswer === index
                      ? index === question.correctAnswer
                        ? "correct"
                        : "wrong"
                      : ""
                  }`}
                  whileHover={{ scale: showExplanation ? 1 : 1.03 }}
                  whileTap={{ scale: showExplanation ? 1 : 0.97 }}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showExplanation}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  className="explanation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {selectedAnswer === question.correctAnswer ? (
                    <div className="explanation-correct">
                      <span className="explanation-icon">😘</span>
                      <span>Correct! You win a kiss!</span>
                    </div>
                  ) : (
                    <div className="explanation-wrong">
                      <span className="explanation-icon">🥺</span>
                      <span>Try again, jaan! ❤️</span>
                    </div>
                  )}
                  <p className="explanation-text">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuizResult({ score, total, restartQuiz }) {
  const percentage = (score / total) * 100;
  let message, emoji;

  if (percentage === 100) {
    message = "Perfect! You know our love story inside out!";
    emoji = "😍💕";
  } else if (percentage >= 70) {
    message = "Amazing! You remember so much about us!";
    emoji = "💖";
  } else if (percentage >= 40) {
    message = "Good! But there's more love to discover!";
    emoji: "💗";
  } else {
    message = "Time to make more memories together!";
    emoji = "💕";
  }

  return (
    <motion.div
      className="quiz-result glass-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="result-emoji">{emoji}</div>
      <h2>Quiz Complete!</h2>
      <div className="result-score">
        <span className="score-number">{score}</span>
        <span className="score-total">/{total}</span>
      </div>
      <p className="result-message">{message}</p>

      <div className="result-rewards">
        {percentage >= 50 && (
          <motion.div
            className="reward"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="reward-icon">😘</span>
            <span>You won {Math.floor(percentage / 20)} kisses!</span>
          </motion.div>
        )}
        {percentage === 100 && (
          <motion.div
            className="reward special"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="reward-icon">🎁</span>
            <span>Bonus: One special surprise date!</span>
          </motion.div>
        )}
      </div>

      <motion.button
        className="btn-romantic restart-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={restartQuiz}
      >
        Play Again 🔄
      </motion.button>
    </motion.div>
  );
}

export default Quiz;
