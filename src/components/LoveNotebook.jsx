import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoveNotebook.css";

// Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://astha-backend-alpha.vercel.app";

function LoveNotebook() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AUTO REFRESH NOTES
  useEffect(() => {
    fetchNotes();

    const interval = setInterval(() => {
      fetchNotes();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/notes`);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();

      if (data.success) {
        const formattedNotes = data.data.map((note) => ({
          ...note,
          date: new Date(note.createdAt).toLocaleString(),
          mood: getMoodFromCategory(note.category),
        }));

        setNotes(formattedNotes);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load notes");
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

  // ADD NOTE
  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content) return;

    const moods = ["❤️", "💕", "💗", "💖", "💘"];

    const selectedMood = moods[Math.floor(Math.random() * moods.length)];

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
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
        setNewNote({
          title: "",
          content: "",
        });

        setShowForm(false);

        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  // EDIT NOTE
  const handleEditNote = (note) => {
    setEditingNote(note);

    setNewNote({
      title: note.title,
      content: note.content,
    });

    setShowForm(true);
  };

  // UPDATE NOTE
  const handleUpdateNote = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${editingNote._id}`, {
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
        setShowForm(false);
        setEditingNote(null);

        setNewNote({
          title: "",
          content: "",
        });

        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  // DELETE NOTE
  const handleDeleteNote = async (id) => {
    const confirmDelete = window.confirm("Delete this note?");

    if (!confirmDelete) return;

    try {
      await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });

      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="loading-state">
        <h2>Loading Love Notes 💕</h2>
      </div>
    );
  }

  return (
    <div className="notebook-page">
      <div className="notebook-container">
        <motion.div
          className="notebook-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1>Love Notebook ❤️</h1>
          <p>Shared memories between us</p>

          {error && <p className="error-message">{error}</p>}
        </motion.div>

        <div className="notebook-actions">
          <input
            type="text"
            placeholder="Search notes..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="btn-romantic"
            onClick={() => {
              setShowForm(!showForm);

              setEditingNote(null);

              setNewNote({
                title: "",
                content: "",
              });
            }}
          >
            {showForm ? "Cancel" : "✍️ Add Note"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="note-form glass-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <input
                type="text"
                placeholder="Title"
                className="note-title-input"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                rows="6"
                placeholder="Write your feelings..."
                className="note-content-input"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    content: e.target.value,
                  })
                }
              />

              <button
                className="btn-romantic"
                onClick={editingNote ? handleUpdateNote : handleAddNote}
              >
                {editingNote ? "Update Note" : "Save Note"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              className="note-card glass-card"
              whileHover={{
                y: -5,
              }}
            >
              <div className="note-mood">{note.mood}</div>

              <div className="note-date">{note.date}</div>

              <h3>{note.title}</h3>

              <p>{note.content}</p>

              <div className="note-actions">
                <button onClick={() => handleEditNote(note)}>✏️</button>

                <button onClick={() => handleDeleteNote(note._id)}>🗑️</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoveNotebook;
