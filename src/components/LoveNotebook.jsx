import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoveNotebook.css";

// API Base URL - Change this to your deployed backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function LoveNotebook() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes from API on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}notes`);
      const data = await response.json();

      if (data.success) {
        // Transform API data to match our component format
        const transformedNotes = data.data.map((note) => ({
          ...note,
          date: new Date(note.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          mood: getMoodFromCategory(note.category),
        }));
        setNotes(transformedNotes);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(
        "Could not load notes. Make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getMoodFromCategory = (category) => {
    const moods = {
      love: "❤️",
      memory: "💕",
      promise: "💗",
      future: "💖",
      other: "💘",
    };
    return moods[category] || "❤️";
  };

  const getCategoryFromMood = (mood) => {
    const categories = {
      "❤️": "love",
      "💕": "memory",
      "💗": "promise",
      "💖": "future",
      "💘": "other",
    };
    return categories[mood] || "love";
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const moods = ["❤️", "💕", "💗", "💖", "💘", "💝"];
    const selectedMood = moods[Math.floor(Math.random() * moods.length)];

    try {
      const response = await fetch(`${API_BASE_URL}notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          category: getCategoryFromMood(selectedMood),
          color: "#ff69b4",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const transformedNote = {
          ...data.data,
          date: new Date(data.data.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          mood: selectedMood,
        };
        setNotes([transformedNote, ...notes]);
        setNewNote({ title: "", content: "" });
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleUpdateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}notes/${editingNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          category: getCategoryFromMood(editingNote.mood),
          color: editingNote.color,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedNotes = notes.map((note) =>
          note._id === editingNote._id
            ? {
                ...data.data,
                date: new Date(data.data.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                ),
                mood: editingNote.mood,
              }
            : note,
        );
        setNotes(updatedNotes);
        setNewNote({ title: "", content: "" });
        setEditingNote(null);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note. Please try again.");
    }
  };

  const handleDeleteNote = async (id, mongodbId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );
    if (confirmDelete) {
      try {
        await fetch(`${API_BASE_URL}notes/${mongodbId}`, {
          method: "DELETE",
        });
        setNotes(notes.filter((note) => note._id !== mongodbId));
      } catch (err) {
        console.error("Error deleting note:", err);
        alert("Failed to delete note. Please try again.");
      }
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNewNote({ title: "", content: "" });
    setShowForm(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="notebook-page">
        <div className="notebook-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your love notes... 💕</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notebook-page">
      <div className="notebook-container">
        <motion.div
          className="notebook-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Love Notebook 📝</h1>
          <p>My thoughts and feelings for you, my love</p>
          {error && <p className="error-message">{error}</p>}
        </motion.div>

        <div className="notebook-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.button
            className="btn-romantic add-note-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingNote(null);
              setNewNote({ title: "", content: "" });
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "✍️ Write a Note"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="note-form glass-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3>{editingNote ? "Edit Note" : "Write a New Note"}</h3>
              <input
                type="text"
                className="note-title-input"
                placeholder="Title your love letter..."
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
              <textarea
                className="note-content-input"
                placeholder="Write your heart out..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                rows="6"
              />
              <div className="note-form-actions">
                <button
                  className="btn-romantic save-btn"
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                >
                  {editingNote ? "Update Note" : "Save Note"} 💕
                </button>
                {editingNote && (
                  <button
                    className="btn-romantic cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="notes-grid">
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note._id || note.id}
                className="note-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 40px rgba(233, 30, 99, 0.3)",
                }}
              >
                <div className="note-mood">{note.mood}</div>
                <div className="note-date">{note.date}</div>
                <h3 className="note-title">{note.title}</h3>
                <p className="note-content">{note.content}</p>
                <div className="note-actions">
                  <button
                    className="note-action-btn edit-btn"
                    onClick={() => handleEditNote(note)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="note-action-btn delete-btn"
                    onClick={() => handleDeleteNote(note, note._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && !loading && (
          <div className="no-notes">
            <p>No notes yet. Write your first love note! 💕</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveNotebook;
