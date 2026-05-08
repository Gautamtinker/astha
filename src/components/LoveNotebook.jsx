import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoveNotebook.css";

function LoveNotebook() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("loveNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Add some default notes
      const defaultNotes = [
        {
          id: Date.now(),
          title: "My Dearest Astha ❤️",
          content:
            "From the moment I met you, my life has been filled with so much love and happiness. Every day with you feels like a beautiful dream I never want to wake up from. You are my everything, my soulmate, my best friend. I love you more than words can ever express.",
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          mood: "❤️",
        },
        {
          id: Date.now() - 1,
          title: "Why I Love You 💕",
          content:
            "I love the way you smile, the way you laugh, the way you make everything better just by being there. Your kindness, your warmth, your beautiful heart - everything about you makes me fall in love with you over and over again.",
          date: new Date(Date.now() - 86400000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          mood: "💕",
        },
      ];
      setNotes(defaultNotes);
      localStorage.setItem("loveNotes", JSON.stringify(defaultNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("loveNotes", JSON.stringify(notes));
    }
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const moods = ["❤️", "💕", "💗", "💖", "💘", "💝"];
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      mood: moods[Math.floor(Math.random() * moods.length)],
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "" });
    setShowForm(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleUpdateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? { ...note, title: newNote.title, content: newNote.content }
        : note,
    );

    setNotes(updatedNotes);
    setNewNote({ title: "", content: "" });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleDeleteNote = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );
    if (confirmDelete) {
      setNotes(notes.filter((note) => note.id !== id));
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
                key={note.id}
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
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && (
          <div className="no-notes">
            <p>No notes yet. Write your first love note! 💕</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveNotebook;
