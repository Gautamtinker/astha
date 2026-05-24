const mongoose = require("mongoose");
const axios = require("axios");
const FormData = require("form-data");

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

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  school: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exam Schema
const examSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100,
  },
  passingMarks: {
    type: Number,
    default: 33,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  questions: [
    {
      questionNumber: {
        type: Number,
        required: true,
      },
      questionText: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
        default: 1,
      },
      modelAnswer: {
        type: String,
        required: true,
      },
      keywords: [String],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  class: {
    type: String,
    trim: true,
  },
  section: {
    type: String,
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Answer Sheet Schema
const answerSheetSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  images: [
    {
      url: String,
      ocrText: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  extractedText: {
    type: String,
  },
  answers: [
    {
      questionNumber: {
        type: Number,
        required: true,
      },
      studentAnswer: {
        type: String,
        required: true,
      },
    },
  ],
  grading: {
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "reviewed"],
      default: "pending",
    },
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
    },
    questionWiseMarks: [
      {
        questionNumber: Number,
        marksObtained: Number,
        maxMarks: Number,
        feedback: String,
        keywordsMatched: [String],
      },
    ],
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: String,
      enum: ["ai", "teacher", "hybrid"],
    },
  },
  aiAnalysis: {
    confidence: {
      type: Number,
      default: 0,
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
const AnswerSheet =
  mongoose.models.AnswerSheet ||
  mongoose.model("AnswerSheet", answerSheetSchema);

// Helper function to calculate grade
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

// Helper function for AI-based answer checking
const checkAnswerWithAI = async (
  studentAnswer,
  modelAnswer,
  keywords,
  maxMarks,
) => {
  try {
    // Using a simple keyword matching algorithm with similarity scoring
    const studentWords = studentAnswer.toLowerCase().split(/\s+/);
    const modelWords = modelAnswer.toLowerCase().split(/\s+/);
    const keywordList = keywords || [];

    // Calculate keyword match score
    let keywordsMatched = [];
    let keywordScore = 0;

    if (keywordList.length > 0) {
      keywordList.forEach((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        if (studentAnswer.toLowerCase().includes(lowerKeyword)) {
          keywordsMatched.push(keyword);
        }
      });
      keywordScore = keywordsMatched.length / keywordList.length;
    }

    // Calculate text similarity using Jaccard similarity
    const studentSet = new Set(studentWords);
    const modelSet = new Set(modelWords);
    const intersection = [...studentSet].filter((word) => modelSet.has(word));
    const union = new Set([...studentSet, ...modelSet]);
    const textSimilarity = intersection.length / union.size;

    // Calculate length ratio (penalize very short answers)
    const lengthRatio = Math.min(
      studentAnswer.length / modelAnswer.length,
      1.5,
    );
    const lengthScore = Math.min(lengthRatio, 1);

    // Combined score
    const combinedScore =
      keywordScore * 0.4 + textSimilarity * 0.4 + lengthScore * 0.2;
    const marksObtained = Math.round(combinedScore * maxMarks * 10) / 10;

    // Generate feedback
    let feedback = "";
    if (combinedScore >= 0.8) {
      feedback = "Excellent answer with good coverage of key concepts.";
    } else if (combinedScore >= 0.6) {
      feedback = "Good answer but could include more key points.";
    } else if (combinedScore >= 0.4) {
      feedback = "Average answer. Focus on including more relevant keywords.";
    } else {
      feedback = "Answer needs improvement. Review the topic and try again.";
    }

    return {
      marksObtained,
      feedback,
      keywordsMatched,
      confidence: Math.round(combinedScore * 100),
    };
  } catch (error) {
    console.error("Error in AI checking:", error);
    return {
      marksObtained: 0,
      feedback: "Error in evaluating answer.",
      keywordsMatched: [],
      confidence: 0,
    };
  }
};

// OCR Function using Tesseract.js (client-side) or external API
const performOCR = async (imageUrl) => {
  // For serverless, we'll use a simple text extraction approach
  // In production, you would use Google Vision API, AWS Textract, or Azure OCR
  try {
    // This is a placeholder - in production, integrate with actual OCR service
    const ocrResult = {
      text: "OCR text extraction would be performed here",
      confidence: 0.95,
    };
    return ocrResult;
  } catch (error) {
    console.error("OCR Error:", error);
    return { text: "", confidence: 0 };
  }
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectDB();

    const urlParts = req.url.split("/").filter(Boolean);
    const resource = urlParts[0]; // teachers, exams, students, answersheets, grade

    switch (resource) {
      // ==================== TEACHERS ====================
      case "teachers": {
        switch (req.method) {
          case "GET": {
            if (req.query.id) {
              const teacher = await Teacher.findById(req.query.id);
              if (!teacher) {
                return res
                  .status(404)
                  .json({ success: false, error: "Teacher not found" });
              }
              return res.status(200).json({ success: true, data: teacher });
            }
            if (req.query.email) {
              const teacher = await Teacher.findOne({ email: req.query.email });
              if (!teacher) {
                return res
                  .status(404)
                  .json({ success: false, error: "Teacher not found" });
              }
              return res.status(200).json({ success: true, data: teacher });
            }
            const teachers = await Teacher.find().select("-password");
            return res.status(200).json({ success: true, data: teachers });
          }

          case "POST": {
            const { name, email, password, subject, school } = req.body;
            if (!name || !email || !password) {
              return res.status(400).json({
                success: false,
                error: "Name, email, and password are required",
              });
            }
            const existingTeacher = await Teacher.findOne({ email });
            if (existingTeacher) {
              return res.status(409).json({
                success: false,
                error: "Teacher with this email already exists",
              });
            }
            const teacher = new Teacher({
              name,
              email,
              password,
              subject,
              school,
            });
            await teacher.save();
            return res.status(201).json({
              success: true,
              data: { ...teacher.toObject(), password: undefined },
            });
          }

          case "PUT": {
            const { id } = req.query;
            const updateData = req.body;
            const teacher = await Teacher.findByIdAndUpdate(
              id,
              { ...updateData, updatedAt: Date.now() },
              { new: true, runValidators: true },
            ).select("-password");
            if (!teacher) {
              return res
                .status(404)
                .json({ success: false, error: "Teacher not found" });
            }
            return res.status(200).json({ success: true, data: teacher });
          }

          case "DELETE": {
            const { id } = req.query;
            const teacher = await Teacher.findByIdAndDelete(id);
            if (!teacher) {
              return res
                .status(404)
                .json({ success: false, error: "Teacher not found" });
            }
            return res
              .status(200)
              .json({ success: true, message: "Teacher deleted successfully" });
          }

          default:
            return res
              .status(405)
              .json({ success: false, error: "Method not allowed" });
        }
      }

      // ==================== EXAMS ====================
      case "exams": {
        switch (req.method) {
          case "GET": {
            if (req.query.id) {
              const exam = await Exam.findById(req.query.id).populate(
                "teacher",
                "name email subject",
              );
              if (!exam) {
                return res
                  .status(404)
                  .json({ success: false, error: "Exam not found" });
              }
              return res.status(200).json({ success: true, data: exam });
            }
            if (req.query.teacherId) {
              const exams = await Exam.find({ teacher: req.query.teacherId })
                .populate("teacher", "name email subject")
                .sort({ createdAt: -1 });
              return res.status(200).json({ success: true, data: exams });
            }
            const exams = await Exam.find()
              .populate("teacher", "name email subject")
              .sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: exams });
          }

          case "POST": {
            const {
              teacher,
              title,
              subject,
              description,
              totalMarks,
              passingMarks,
              duration,
              questions,
            } = req.body;
            if (!teacher || !title || !subject || !questions) {
              return res.status(400).json({
                success: false,
                error: "Teacher, title, subject, and questions are required",
              });
            }
            const exam = new Exam({
              teacher,
              title,
              subject,
              description,
              totalMarks,
              passingMarks,
              duration,
              questions,
            });
            await exam.save();
            return res.status(201).json({ success: true, data: exam });
          }

          case "PUT": {
            const { id } = req.query;
            const updateData = req.body;
            const exam = await Exam.findByIdAndUpdate(
              id,
              { ...updateData, updatedAt: Date.now() },
              { new: true, runValidators: true },
            );
            if (!exam) {
              return res
                .status(404)
                .json({ success: false, error: "Exam not found" });
            }
            return res.status(200).json({ success: true, data: exam });
          }

          case "DELETE": {
            const { id } = req.query;
            const exam = await Exam.findByIdAndDelete(id);
            if (!exam) {
              return res
                .status(404)
                .json({ success: false, error: "Exam not found" });
            }
            return res
              .status(200)
              .json({ success: true, message: "Exam deleted successfully" });
          }

          default:
            return res
              .status(405)
              .json({ success: false, error: "Method not allowed" });
        }
      }

      // ==================== STUDENTS ====================
      case "students": {
        switch (req.method) {
          case "GET": {
            if (req.query.id) {
              const student = await Student.findById(req.query.id);
              if (!student) {
                return res
                  .status(404)
                  .json({ success: false, error: "Student not found" });
              }
              return res.status(200).json({ success: true, data: student });
            }
            if (req.query.teacherId) {
              const students = await Student.find({
                teacher: req.query.teacherId,
              }).sort({ createdAt: -1 });
              return res.status(200).json({ success: true, data: students });
            }
            const students = await Student.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: students });
          }

          case "POST": {
            const {
              name,
              rollNumber,
              email,
              class: studentClass,
              section,
              teacher,
            } = req.body;
            if (!name || !rollNumber || !teacher) {
              return res.status(400).json({
                success: false,
                error: "Name, roll number, and teacher are required",
              });
            }
            const existingStudent = await Student.findOne({
              rollNumber,
              teacher,
            });
            if (existingStudent) {
              return res.status(409).json({
                success: false,
                error:
                  "Student with this roll number already exists for this teacher",
              });
            }
            const student = new Student({
              name,
              rollNumber,
              email,
              class: studentClass,
              section,
              teacher,
            });
            await student.save();
            return res.status(201).json({ success: true, data: student });
          }

          case "PUT": {
            const { id } = req.query;
            const updateData = req.body;
            const student = await Student.findByIdAndUpdate(
              id,
              { ...updateData, updatedAt: Date.now() },
              { new: true, runValidators: true },
            );
            if (!student) {
              return res
                .status(404)
                .json({ success: false, error: "Student not found" });
            }
            return res.status(200).json({ success: true, data: student });
          }

          case "DELETE": {
            const { id } = req.query;
            const student = await Student.findByIdAndDelete(id);
            if (!student) {
              return res
                .status(404)
                .json({ success: false, error: "Student not found" });
            }
            return res
              .status(200)
              .json({ success: true, message: "Student deleted successfully" });
          }

          default:
            return res
              .status(405)
              .json({ success: false, error: "Method not allowed" });
        }
      }

      // ==================== ANSWER SHEETS ====================
      case "answersheets":
      case "answer-sheets": {
        switch (req.method) {
          case "GET": {
            if (req.query.id) {
              const answerSheet = await AnswerSheet.findById(req.query.id)
                .populate("student", "name rollNumber class section")
                .populate("exam", "title subject totalMarks questions")
                .populate("teacher", "name email");
              if (!answerSheet) {
                return res
                  .status(404)
                  .json({ success: false, error: "Answer sheet not found" });
              }
              return res.status(200).json({ success: true, data: answerSheet });
            }

            const query = {};
            if (req.query.examId) query.exam = req.query.examId;
            if (req.query.studentId) query.student = req.query.studentId;
            if (req.query.teacherId) query.teacher = req.query.teacherId;
            if (req.query.status) query["grading.status"] = req.query.status;

            const answerSheets = await AnswerSheet.find(query)
              .populate("student", "name rollNumber class section")
              .populate("exam", "title subject totalMarks")
              .populate("teacher", "name email")
              .sort({ uploadedAt: -1 });
            return res.status(200).json({ success: true, data: answerSheets });
          }

          case "POST": {
            const { student, exam, teacher, images, extractedText, answers } =
              req.body;
            if (!student || !exam || !teacher) {
              return res.status(400).json({
                success: false,
                error: "Student, exam, and teacher are required",
              });
            }
            const answerSheet = new AnswerSheet({
              student,
              exam,
              teacher,
              images: images || [],
              extractedText,
              answers: answers || [],
            });
            await answerSheet.save();
            return res.status(201).json({ success: true, data: answerSheet });
          }

          case "PUT": {
            const { id } = req.query;
            const updateData = req.body;
            const answerSheet = await AnswerSheet.findByIdAndUpdate(
              id,
              { ...updateData, updatedAt: Date.now() },
              { new: true, runValidators: true },
            )
              .populate("student", "name rollNumber class section")
              .populate("exam", "title subject totalMarks");
            if (!answerSheet) {
              return res
                .status(404)
                .json({ success: false, error: "Answer sheet not found" });
            }
            return res.status(200).json({ success: true, data: answerSheet });
          }

          case "DELETE": {
            const { id } = req.query;
            const answerSheet = await AnswerSheet.findByIdAndDelete(id);
            if (!answerSheet) {
              return res
                .status(404)
                .json({ success: false, error: "Answer sheet not found" });
            }
            return res
              .status(200)
              .json({
                success: true,
                message: "Answer sheet deleted successfully",
              });
          }

          default:
            return res
              .status(405)
              .json({ success: false, error: "Method not allowed" });
        }
      }

      // ==================== GRADING ====================
      case "grade": {
        if (req.method !== "POST") {
          return res
            .status(405)
            .json({ success: false, error: "Method not allowed" });
        }

        const { answerSheetId, autoGrade } = req.body;
        if (!answerSheetId) {
          return res.status(400).json({
            success: false,
            error: "Answer sheet ID is required",
          });
        }

        // Find the answer sheet
        const answerSheet = await AnswerSheet.findById(answerSheetId)
          .populate("exam")
          .populate("student");

        if (!answerSheet) {
          return res
            .status(404)
            .json({ success: false, error: "Answer sheet not found" });
        }

        // Update status to processing
        answerSheet.grading.status = "processing";
        await answerSheet.save();

        try {
          const exam = answerSheet.exam;
          const questionWiseMarks = [];
          let totalMarksObtained = 0;
          let totalConfidence = 0;
          let strengths = [];
          let weaknesses = [];
          let suggestions = [];

          // Grade each question
          for (const question of exam.questions) {
            const studentAnswerObj = answerSheet.answers.find(
              (a) => a.questionNumber === question.questionNumber,
            );

            if (studentAnswerObj) {
              const gradingResult = await checkAnswerWithAI(
                studentAnswerObj.studentAnswer,
                question.modelAnswer,
                question.keywords,
                question.marks,
              );

              questionWiseMarks.push({
                questionNumber: question.questionNumber,
                marksObtained: gradingResult.marksObtained,
                maxMarks: question.marks,
                feedback: gradingResult.feedback,
                keywordsMatched: gradingResult.keywordsMatched,
              });

              totalMarksObtained += gradingResult.marksObtained;
              totalConfidence += gradingResult.confidence;

              // Analyze strengths and weaknesses
              if (gradingResult.marksObtained / question.marks >= 0.8) {
                strengths.push(
                  `Excellent understanding of Question ${question.questionNumber}`,
                );
              } else if (gradingResult.marksObtained / question.marks < 0.5) {
                weaknesses.push(
                  `Needs improvement in Question ${question.questionNumber}`,
                );
                suggestions.push(
                  `Review the topic covered in Question ${question.questionNumber}`,
                );
              }
            }
          }

          // Calculate percentage and grade
          const percentage = (totalMarksObtained / exam.totalMarks) * 100;
          const grade = calculateGrade(percentage);

          // Update answer sheet with grading results
          answerSheet.grading = {
            status: autoGrade ? "completed" : "reviewed",
            totalMarksObtained: Math.round(totalMarksObtained * 10) / 10,
            percentage: Math.round(percentage * 10) / 10,
            grade,
            questionWiseMarks,
            gradedAt: new Date(),
            gradedBy: "ai",
          };

          answerSheet.aiAnalysis = {
            confidence: Math.round(totalConfidence / exam.questions.length),
            strengths,
            weaknesses,
            suggestions,
          };

          await answerSheet.save();

          return res.status(200).json({
            success: true,
            data: answerSheet,
            message: "Grading completed successfully",
          });
        } catch (error) {
          answerSheet.grading.status = "pending";
          await answerSheet.save();
          throw error;
        }
      }

      // ==================== BULK GRADE ====================
      case "bulk-grade": {
        if (req.method !== "POST") {
          return res
            .status(405)
            .json({ success: false, error: "Method not allowed" });
        }

        const { examId } = req.body;
        if (!examId) {
          return res.status(400).json({
            success: false,
            error: "Exam ID is required",
          });
        }

        // Find all pending answer sheets for this exam
        const pendingSheets = await AnswerSheet.find({
          exam: examId,
          "grading.status": "pending",
        });

        const results = [];
        for (const sheet of pendingSheets) {
          try {
            const response = await module.exports(
              {
                method: "POST",
                url: `/grade`,
                body: { answerSheetId: sheet._id.toString(), autoGrade: true },
              },
              res,
            );
            results.push({ id: sheet._id, success: true });
          } catch (error) {
            results.push({
              id: sheet._id,
              success: false,
              error: error.message,
            });
          }
        }

        return res.status(200).json({
          success: true,
          data: {
            total: pendingSheets.length,
            graded: results.filter((r) => r.success).length,
            failed: results.filter((r) => !r.success).length,
            results,
          },
        });
      }

      // ==================== REPORTS ====================
      case "reports": {
        switch (req.method) {
          case "GET": {
            if (req.query.examId) {
              // Get exam-wise report
              const answerSheets = await AnswerSheet.find({
                exam: req.query.examId,
              })
                .populate("student", "name rollNumber class section")
                .sort({ "grading.totalMarksObtained": -1 });

              if (answerSheets.length === 0) {
                return res.status(404).json({
                  success: false,
                  error: "No graded answer sheets found for this exam",
                });
              }

              const exam = await Exam.findById(req.query.examId);
              const totalStudents = answerSheets.length;
              const passedStudents = answerSheets.filter(
                (s) => s.grading.totalMarksObtained >= exam.passingMarks,
              ).length;
              const averageMarks =
                answerSheets.reduce(
                  (sum, s) => sum + s.grading.totalMarksObtained,
                  0,
                ) / totalStudents;
              const highestMarks = Math.max(
                ...answerSheets.map((s) => s.grading.totalMarksObtained),
              );
              const lowestMarks = Math.min(
                ...answerSheets.map((s) => s.grading.totalMarksObtained),
              );

              return res.status(200).json({
                success: true,
                data: {
                  exam,
                  totalStudents,
                  passedStudents,
                  failedStudents: totalStudents - passedStudents,
                  passPercentage: (passedStudents / totalStudents) * 100,
                  averageMarks: Math.round(averageMarks * 10) / 10,
                  highestMarks,
                  lowestMarks,
                  students: answerSheets,
                },
              });
            }

            if (req.query.studentId) {
              // Get student-wise report
              const answerSheets = await AnswerSheet.find({
                student: req.query.studentId,
              })
                .populate("exam", "title subject totalMarks")
                .sort({ uploadedAt: -1 });

              const student = await Student.findById(req.query.studentId);

              return res.status(200).json({
                success: true,
                data: {
                  student,
                  totalExams: answerSheets.length,
                  answerSheets,
                },
              });
            }

            return res.status(400).json({
              success: false,
              error: "Please provide examId or studentId",
            });
          }

          default:
            return res
              .status(405)
              .json({ success: false, error: "Method not allowed" });
        }
      }

      // ==================== DASHBOARD STATS ====================
      case "dashboard": {
        if (req.method !== "GET") {
          return res
            .status(405)
            .json({ success: false, error: "Method not allowed" });
        }

        const { teacherId } = req.query;
        if (!teacherId) {
          return res.status(400).json({
            success: false,
            error: "Teacher ID is required",
          });
        }

        const exams = await Exam.find({ teacher: teacherId });
        const students = await Student.find({ teacher: teacherId });
        const answerSheets = await AnswerSheet.find({
          teacher: teacherId,
        }).populate("grading");

        const pendingGrading = answerSheets.filter(
          (s) =>
            s.grading.status === "pending" || s.grading.status === "processing",
        ).length;
        const completedGrading = answerSheets.filter(
          (s) =>
            s.grading.status === "completed" || s.grading.status === "reviewed",
        ).length;

        return res.status(200).json({
          success: true,
          data: {
            totalExams: exams.length,
            totalStudents: students.length,
            totalAnswerSheets: answerSheets.length,
            pendingGrading,
            completedGrading,
            recentExams: exams.slice(0, 5),
            recentActivity: answerSheets.slice(0, 10),
          },
        });
      }

      default:
        return res.status(404).json({
          success: false,
          error:
            "Invalid endpoint. Use: teachers, exams, students, answersheets, grade, bulk-grade, reports, dashboard",
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
