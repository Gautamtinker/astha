import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./StudentReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const StudentReport = () => {
  const [student, setStudent] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

  // Mock student login
  const mockStudentLogin = async () => {
    try {
      // First get a teacher
      const teacherResponse = await fetch(
        `${API_BASE_URL}/grading/teachers?email=demo@teacher.com`,
      );
      const teacherData = await teacherResponse.json();

      if (teacherData.success && teacherData.data) {
        // Get students for this teacher
        const studentsResponse = await fetch(
          `${API_BASE_URL}/grading/students?teacherId=${teacherData.data._id}`,
        );
        const studentsData = await studentsResponse.json();

        if (studentsData.success && studentsData.data.length > 0) {
          return studentsData.data[0];
        }

        // Create demo student if none exists
        const createResponse = await fetch(`${API_BASE_URL}/grading/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Demo Student",
            rollNumber: "STU001",
            email: "demo@student.com",
            class: "10th",
            section: "A",
            teacher: teacherData.data._id,
          }),
        });
        const createData = await createResponse.json();
        if (createData.success) {
          return createData.data;
        }
      }
    } catch (error) {
      console.error("Error logging in student:", error);
    }
    return null;
  };

  useEffect(() => {
    const initializeStudent = async () => {
      const studentData = await mockStudentLogin();
      if (studentData) {
        setStudent(studentData);
        await fetchStudentReports(studentData._id);
      }
      setLoading(false);
    };
    initializeStudent();
  }, []);

  const fetchStudentReports = async (studentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/reports?studentId=${studentId}`,
      );
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error("Error fetching student reports:", error);
    }
  };

  const fetchExamReport = async (examId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/reports?examId=${examId}`,
      );
      const data = await response.json();
      if (data.success) {
        setSelectedExam(data.data);
      }
    } catch (error) {
      console.error("Error fetching exam report:", error);
    }
  };

  if (loading) {
    return (
      <div className="student-report loading">
        <div className="spinner"></div>
        <p>Loading your reports...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-report error">
        <p>Error: Unable to load student account</p>
      </div>
    );
  }

  return (
    <div className="student-report-container">
      <header className="student-header">
        <div className="header-content">
          <div className="student-profile">
            <div className="avatar">{student.name.charAt(0).toUpperCase()}</div>
            <div className="student-info">
              <h1>{student.name}</h1>
              <p className="student-details">
                Roll No: {student.rollNumber} | Class: {student.class}{" "}
                {student.section}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="student-main">
        {selectedExam ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="exam-detail-view"
          >
            <button className="back-btn" onClick={() => setSelectedExam(null)}>
              ← Back to All Reports
            </button>

            <div className="exam-header-card">
              <div className="exam-title-section">
                <h2>{selectedExam.exam.title}</h2>
                <span className="subject-badge">
                  {selectedExam.exam.subject}
                </span>
              </div>
              <div className="exam-score-display">
                <div className="score-circle">
                  <span className="score-value">
                    {selectedExam.students[0]?.grading?.totalMarksObtained || 0}
                  </span>
                  <span className="score-max">
                    /{selectedExam.exam.totalMarks}
                  </span>
                </div>
                <div className="score-percentage">
                  {selectedExam.students[0]?.grading?.percentage || 0}%
                </div>
                <span
                  className={`grade-badge large ${selectedExam.students[0]?.grading?.grade?.toLowerCase()}`}
                >
                  {selectedExam.students[0]?.grading?.grade || "N/A"}
                </span>
              </div>
            </div>

            {selectedExam.students[0]?.grading?.questionWiseMarks && (
              <div className="question-wise-breakdown">
                <h3>Question-wise Breakdown</h3>
                <div className="questions-grid">
                  {selectedExam.students[0].grading.questionWiseMarks.map(
                    (q, index) => (
                      <div key={index} className="question-card">
                        <div className="question-header">
                          <span className="question-number">
                            Q{q.questionNumber}
                          </span>
                          <span className="question-score">
                            {q.marksObtained}/{q.maxMarks}
                          </span>
                        </div>
                        <div className="question-progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(q.marksObtained / q.maxMarks) * 100}%`,
                            }}
                          ></div>
                        </div>
                        {q.feedback && (
                          <p className="question-feedback">{q.feedback}</p>
                        )}
                        {q.keywordsMatched && q.keywordsMatched.length > 0 && (
                          <div className="keywords-matched">
                            <span>
                              ✓ Keywords: {q.keywordsMatched.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {selectedExam.students[0]?.aiAnalysis && (
              <div className="ai-analysis-section">
                <h3>🤖 AI Performance Analysis</h3>

                <div className="confidence-meter">
                  <div className="confidence-label">AI Confidence Score</div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{
                        width: `${selectedExam.students[0].aiAnalysis.confidence}%`,
                      }}
                    ></div>
                  </div>
                  <div className="confidence-value">
                    {selectedExam.students[0].aiAnalysis.confidence}%
                  </div>
                </div>

                {selectedExam.students[0].aiAnalysis.strengths.length > 0 && (
                  <div className="analysis-category strengths">
                    <h4>💪 Strengths</h4>
                    <ul>
                      {selectedExam.students[0].aiAnalysis.strengths.map(
                        (s, i) => (
                          <li key={i}>{s}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {selectedExam.students[0].aiAnalysis.weaknesses.length > 0 && (
                  <div className="analysis-category weaknesses">
                    <h4>📚 Areas for Improvement</h4>
                    <ul>
                      {selectedExam.students[0].aiAnalysis.weaknesses.map(
                        (w, i) => (
                          <li key={i}>{w}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {selectedExam.students[0].aiAnalysis.suggestions.length > 0 && (
                  <div className="analysis-category suggestions">
                    <h4>💡 Recommendations</h4>
                    <ul>
                      {selectedExam.students[0].aiAnalysis.suggestions.map(
                        (s, i) => (
                          <li key={i}>{s}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="reports-overview"
          >
            <h2>Your Exam Reports</h2>

            {reports &&
            reports.answerSheets &&
            reports.answerSheets.length > 0 ? (
              <div className="reports-list">
                {reports.answerSheets.map((sheet) => (
                  <div
                    key={sheet._id}
                    className="report-card"
                    onClick={() => fetchExamReport(sheet.exam._id)}
                  >
                    <div className="report-card-header">
                      <div className="exam-info">
                        <h3>{sheet.exam?.title || "Unknown Exam"}</h3>
                        <span className="exam-subject">
                          {sheet.exam?.subject || ""}
                        </span>
                      </div>
                      <div className="report-grade">
                        <span
                          className={`grade-badge ${sheet.grading?.grade?.toLowerCase()}`}
                        >
                          {sheet.grading?.grade || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="report-card-body">
                      <div className="score-display">
                        <span className="marks-obtained">
                          {sheet.grading?.totalMarksObtained || 0}
                        </span>
                        <span className="marks-total">
                          /{sheet.exam?.totalMarks || 0}
                        </span>
                      </div>
                      <div className="percentage-display">
                        {sheet.grading?.percentage || 0}%
                      </div>
                    </div>

                    <div className="report-card-footer">
                      <span className="report-date">
                        {new Date(sheet.uploadedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span
                        className={`status-indicator ${sheet.grading?.status}`}
                      >
                        {sheet.grading?.status}
                      </span>
                    </div>

                    {sheet.aiAnalysis &&
                      sheet.aiAnalysis.strengths.length > 0 && (
                        <div className="quick-insight">
                          <span className="insight-icon">💡</span>
                          <span>{sheet.aiAnalysis.strengths[0]}</span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reports">
                <div className="no-reports-icon">📋</div>
                <h3>No Reports Yet</h3>
                <p>You haven't submitted any answer sheets for grading yet.</p>
              </div>
            )}

            {/* Performance Summary */}
            {reports &&
              reports.answerSheets &&
              reports.answerSheets.length > 0 && (
                <div className="performance-summary">
                  <h3>Overall Performance</h3>
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="stat-value">
                        {
                          reports.answerSheets.filter(
                            (s) => s.grading?.status === "completed",
                          ).length
                        }
                      </span>
                      <span className="stat-label">Exams Completed</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">
                        {reports.answerSheets.length > 0
                          ? Math.round(
                              reports.answerSheets.reduce(
                                (sum, s) => sum + (s.grading?.percentage || 0),
                                0,
                              ) / reports.answerSheets.length,
                            )
                          : 0}
                        %
                      </span>
                      <span className="stat-label">Average Score</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">
                        {
                          reports.answerSheets.filter((s) => {
                            const grade = s.grading?.grade;
                            return (
                              grade &&
                              ["a+", "a", "b+", "b"].includes(
                                grade.toLowerCase(),
                              )
                            );
                          }).length
                        }
                      </span>
                      <span className="stat-label">A/B Grades</span>
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StudentReport;
