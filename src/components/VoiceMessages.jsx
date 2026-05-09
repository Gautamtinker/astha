import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./VoiceMessages.css";

function VoiceMessages() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Load recordings from localStorage on mount
  useEffect(() => {
    const savedRecordings = localStorage.getItem("voiceMessages");
    if (savedRecordings) {
      try {
        const parsed = JSON.parse(savedRecordings);
        setRecordings(parsed);
      } catch (e) {
        console.log("Could not load saved recordings");
      }
    }
  }, []);

  // Save recordings to localStorage
  useEffect(() => {
    localStorage.setItem("voiceMessages", JSON.stringify(recordings));
  }, [recordings]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError("");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        "Could not access microphone. Please allow microphone permission.",
      );
      console.error("Microphone access denied:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Save recording with title
  const saveRecording = () => {
    if (!audioBlob) return;
    if (!messageTitle.trim()) {
      setError("Please enter a title for your voice message");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const audioUrl = reader.result;
      const newRecording = {
        id: Date.now(),
        title: messageTitle,
        audioUrl: audioUrl,
        duration: recordingTime,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setRecordings((prev) => [newRecording, ...prev]);
      setAudioBlob(null);
      setMessageTitle("");
      setRecordingTime(0);
      setError("");
    };
    reader.readAsDataURL(audioBlob);
  };

  // Play/Pause recording
  const togglePlayback = (recording) => {
    if (playingId === recording.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setPlayingId(null);
      }
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(recording.audioUrl);
      audioPlayerRef.current = audio;
      audio.play();
      setPlayingId(recording.id);
      audio.onended = () => setPlayingId(null);
    }
  };

  // Delete recording
  const deleteRecording = (id) => {
    if (window.confirm("Are you sure you want to delete this voice message?")) {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      if (playingId === id) {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        setPlayingId(null);
      }
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Cancel new recording
  const cancelRecording = () => {
    setAudioBlob(null);
    setMessageTitle("");
    setRecordingTime(0);
    setError("");
  };

  return (
    <div className="voice-messages-page">
      <div className="voice-messages-container">
        <motion.div
          className="voice-messages-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>🎤 Voice Messages</h1>
          <p className="voice-subtitle">
            Record and save sweet voice messages for Astha 💕
          </p>

          {/* Recording Section */}
          <div className="recording-section">
            {!audioBlob ? (
              <>
                <motion.button
                  className={`record-btn ${isRecording ? "recording" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <span className="record-icon">
                    {isRecording ? "⏹️" : "🎤"}
                  </span>
                  <span className="record-text">
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </span>
                </motion.button>

                {isRecording && (
                  <div className="recording-timer">
                    <div className="timer-display">
                      <span className="timer-icon">⏱️</span>
                      <span className="timer-text">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <div className="recording-indicator">
                      <span className="pulse-dot"></span>
                      Recording...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="preview-section">
                <h3>🎵 Preview Your Recording</h3>
                <div className="preview-duration">
                  Duration: {formatTime(recordingTime)}
                </div>

                <div className="title-input-group">
                  <label>Message Title</label>
                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="e.g., Good Morning Love, I miss you, etc."
                    maxLength={50}
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="preview-buttons">
                  <motion.button
                    className="save-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveRecording}
                  >
                    💾 Save Message
                  </motion.button>
                  <motion.button
                    className="cancel-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelRecording}
                  >
                    🗑️ Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Recordings */}
          <div className="saved-recordings">
            <h2>💌 Saved Voice Messages ({recordings.length})</h2>

            {recordings.length === 0 ? (
              <div className="no-recordings">
                <span className="no-recordings-icon">🎤</span>
                <p>No voice messages yet. Start recording!</p>
              </div>
            ) : (
              <div className="recordings-list">
                {recordings.map((recording) => (
                  <motion.div
                    key={recording.id}
                    className="recording-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="recording-info">
                      <h4 className="recording-title">{recording.title}</h4>
                      <p className="recording-meta">
                        📅 {recording.date} • ⏱️{" "}
                        {formatTime(recording.duration)}
                      </p>
                    </div>

                    <div className="recording-controls">
                      <motion.button
                        className={`play-btn ${playingId === recording.id ? "playing" : ""}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => togglePlayback(recording)}
                      >
                        {playingId === recording.id ? "⏸️" : "▶️"}
                      </motion.button>
                      <motion.button
                        className="delete-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRecording(recording.id)}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="voice-tips">
            <h3>💡 Tips for Sweet Voice Messages</h3>
            <ul>
              <li>🌅 Record good morning/night messages</li>
              <li>💕 Tell her what you love about her</li>
              <li>🎵 Sing a romantic song for her</li>
              <li>📖 Recite a poem or love quote</li>
              <li>🥰 Share your feelings and emotions</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default VoiceMessages;
