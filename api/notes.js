const mongoose = require("mongoose");

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Note Schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["love", "memory", "promise", "future", "other"],
    default: "love",
  },
  color: {
    type: String,
    default: "#ff69b4",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectDB();

    switch (req.method) {
      case "GET": {
        // Get all notes or single note
        if (req.query.id) {
          const note = await Note.findById(req.query.id);
          if (!note) {
            return res
              .status(404)
              .json({ success: false, error: "Note not found" });
          }
          return res.status(200).json({ success: true, data: note });
        }

        const notes = await Note.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: notes });
      }

      case "POST": {
        const { title, content, category, color } = req.body;

        if (!title || !content) {
          return res.status(400).json({
            success: false,
            error: "Title and content are required",
          });
        }

        const note = new Note({
          title,
          content,
          category: category || "love",
          color: color || "#ff69b4",
        });

        await note.save();
        return res.status(201).json({ success: true, data: note });
      }

      case "PUT": {
        const { id } = req.query;
        const { title, content, category, color } = req.body;

        const note = await Note.findByIdAndUpdate(
          id,
          {
            title,
            content,
            category,
            color,
            updatedAt: Date.now(),
          },
          { new: true, runValidators: true },
        );

        if (!note) {
          return res
            .status(404)
            .json({ success: false, error: "Note not found" });
        }

        return res.status(200).json({ success: true, data: note });
      }

      case "DELETE": {
        const { id } = req.query;
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
          return res
            .status(404)
            .json({ success: false, error: "Note not found" });
        }

        return res
          .status(200)
          .json({ success: true, message: "Note deleted successfully" });
      }

      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
