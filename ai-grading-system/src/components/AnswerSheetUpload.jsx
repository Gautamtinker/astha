import { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./AnswerSheetUpload.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const AnswerSheetUpload = ({
  onClose,
  onUploadSuccess,
  teacher,
  exams,
  students,
}) => {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [ocrResults, setOcrResults] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Simulate OCR processing (in production, use actual OCR service)
  const processOCR = async () => {
    setUploading(true);
    setCurrentStep(2);

    // Simulate OCR processing for each image
    const results = [];
    let fullText = "";

    for (let i = 0; i < images.length; i++) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock OCR result - in production, this would call actual OCR service
      const mockOcrText = `This is extracted text from image ${i + 1}. 
      In a real implementation, this would contain the actual text extracted from the answer sheet image.
      Question 1: Photosynthesis is the process by which plants convert light energy into chemical energy.
      Question 2: The mitochondria is the powerhouse of the cell.
      Question 3: DNA replication occurs during the S phase of the cell cycle.`;

      results.push({
        imageIndex: i,
        text: mockOcrText,
        confidence: 0.85 + Math.random() * 0.15,
      });

      fullText += mockOcrText + "\n\n";
    }

    setOcrResults(results);
    setExtractedText(fullText);
    setUploading(false);
    setCurrentStep(3);
  };

  const parseAnswers = () => {
    // Parse extracted text to identify answers
    // This is a simplified parser - in production, use more sophisticated NLP
    const questionPatterns = [
      /Question\s*\d+[:.]\s*/i,
      /Q\s*\d+[:.]\s*/i,
      /\d+[).]\s*/,
    ];

    const parsedAnswers = [];
    let currentQuestion = null;
    let currentAnswer = "";

    const lines = extractedText.split("\n");

    lines.forEach((line) => {
      const questionMatch = line.match(/Question\s*(\d+)/i);

      if (questionMatch) {
        if (currentQuestion !== null && currentAnswer.trim()) {
          parsedAnswers.push({
            questionNumber: currentQuestion,
            studentAnswer: currentAnswer.trim(),
          });
        }
        currentQuestion = parseInt(questionMatch[1]);
        currentAnswer = line.replace(/Question\s*\d+[:.]\s*/i, "");
      } else if (currentQuestion !== null) {
        currentAnswer += " " + line;
      }
    });

    // Add the last question
    if (currentQuestion !== null && currentAnswer.trim()) {
      parsedAnswers.push({
        questionNumber: currentQuestion,
        studentAnswer: currentAnswer.trim(),
      });
    }

    setAnswers(parsedAnswers);
    setCurrentStep(4);
  };

  const handleSubmit = async () => {
    if (!selectedExam || !selectedStudent || answers.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      // Upload answer sheet
      const response = await fetch(`${API_BASE_URL}/grading/answersheets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: selectedStudent,
          exam: selectedExam,
          teacher: teacher._id,
          images: images.map((img, index) => ({
            url: img.preview,
            ocrText: ocrResults[index]?.text || "",
          })),
          extractedText,
          answers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Trigger auto-grading
        const gradeResponse = await fetch(`${API_BASE_URL}/grading/grade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answerSheetId: data.data._id,
            autoGrade: true,
          }),
        });

        const gradeData = await gradeResponse.json();

        if (gradeData.success) {
          if (onUploadSuccess) {
            onUploadSuccess(gradeData.data);
          }
          onClose();
        }
      }
    } catch (error) {
      console.error("Error uploading answer sheet:", error);
      alert("Failed to upload answer sheet");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="upload-modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="upload-modal"
      >
        <div className="upload-modal-header">
          <h2>Upload Answer Sheet</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="upload-progress">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span>Upload Images</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span>OCR Processing</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Extract Text</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
            <div className="step-number">4</div>
            <span>Review & Submit</span>
          </div>
        </div>

        <div className="upload-modal-content">
          {currentStep === 1 && (
            <div className="upload-step">
              <div className="select-section">
                <div className="form-group">
                  <label>Select Exam *</label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                  >
                    <option value="">Choose an exam</option>
                    {exams.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title} - {exam.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Student *</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className="drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <div className="drop-zone-content">
                  <div className="upload-icon">📷</div>
                  <h3>Drop images here or click to browse</h3>
                  <p>Support JPG, PNG, PDF (max 10MB per file)</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img.preview} alt={`Page ${index + 1}`} />
                      <button
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                      <span className="image-name">{img.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="step-actions">
                <button
                  className="secondary-btn"
                  onClick={onClose}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  onClick={processOCR}
                  disabled={
                    images.length === 0 ||
                    !selectedExam ||
                    !selectedStudent ||
                    uploading
                  }
                >
                  {uploading ? "Processing..." : "Process OCR →"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="upload-step">
              <div className="processing-state">
                <div className="processing-animation">
                  <div className="scanner-line"></div>
                  <div className="document-icon">📄</div>
                </div>
                <h3>Processing Images with OCR</h3>
                <p>Extracting text from {images.length} image(s)...</p>
                <div className="processing-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(ocrResults.length / images.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span>
                    {Math.round((ocrResults.length / images.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="upload-step">
              <div className="extracted-text-section">
                <h3>Extracted Text</h3>
                <div className="text-display">
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="extracted-text-area"
                  />
                </div>
                <p className="text-info">
                  You can edit the extracted text if needed before proceeding.
                </p>
              </div>

              <div className="step-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  ← Back
                </button>
                <button className="primary-btn" onClick={parseAnswers}>
                  Parse Answers →
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="upload-step">
              <div className="review-section">
                <h3>Review Parsed Answers</h3>

                {answers.length > 0 ? (
                  <div className="answers-list">
                    {answers.map((answer, index) => (
                      <div key={index} className="answer-item">
                        <div className="answer-header">
                          <span className="question-label">
                            Question {answer.questionNumber}
                          </span>
                        </div>
                        <div className="answer-content">
                          {answer.studentAnswer || "(No answer detected)"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-answers-warning">
                    <div className="warning-icon">⚠️</div>
                    <h4>No answers could be parsed</h4>
                    <p>
                      The system couldn't identify any questions in the
                      extracted text. You can go back and edit the text, or
                      manually enter answers.
                    </p>
                    <button
                      className="secondary-btn"
                      onClick={() => setCurrentStep(3)}
                    >
                      Edit Extracted Text
                    </button>
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setCurrentStep(3)}
                  disabled={uploading}
                >
                  ← Back
                </button>
                <button
                  className="primary-btn"
                  onClick={handleSubmit}
                  disabled={uploading || answers.length === 0}
                >
                  {uploading ? "Submitting..." : "Submit for Grading ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnswerSheetUpload;
