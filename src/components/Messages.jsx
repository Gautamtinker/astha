import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("loveMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add default welcome message
      const defaultMessage = {
        id: Date.now(),
        text: "Welcome to our special place! Write me a message anytime, my love. ❤️",
        sender: "System",
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: true,
      };
      setMessages([defaultMessage]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("loveMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "You",
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSystem: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Add a sweet auto-reply after a delay
    setTimeout(() => {
      const replies = [
        "I love you so much! ❤️",
        "You mean the world to me! 💕",
        "Every message from you makes my day! 🌟",
        "I'm so lucky to have you! 💖",
        "You're my everything! 😘",
        "My heart smiles every time I see your message! 💗",
        "I love you more than yesterday, less than tomorrow! 🌹",
        "You're the best thing that ever happened to me! 💝",
      ];

      const reply = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: "Gautam",
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: false,
      };

      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const clearMessages = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all messages?",
    );
    if (confirmClear) {
      setMessages([]);
      localStorage.removeItem("loveMessages");
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <motion.div
          className="messages-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Love Messages 💌</h1>
          <p>Write your heart out, my love</p>
        </motion.div>

        <div className="messages-wrapper">
          <div className="messages-box glass-card">
            <div className="messages-list">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`message ${
                      msg.isSystem
                        ? "system"
                        : msg.sender === "You"
                          ? "sent"
                          : "received"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="message-content">
                      <p className="message-text">{msg.text}</p>
                      <div className="message-meta">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                placeholder="Type your loving message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <motion.button
                type="submit"
                className="send-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!newMessage.trim()}
              >
                Send ❤️
              </motion.button>
            </form>
          </div>

          <div className="messages-footer">
            <button className="clear-btn" onClick={clearMessages}>
              Clear Messages 🗑️
            </button>
            <p className="footer-note">
              Messages are saved permanently in your browser 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
