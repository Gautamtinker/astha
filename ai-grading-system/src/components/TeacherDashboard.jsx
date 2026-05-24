import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./TeacherDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [answerSheets, setAnswerSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showExamModal, setShowExamModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    subject: "",
    description: "",
    totalMarks: 100,
    passingMarks: 33,
    duration: 60,
    questions: [],
  });
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNumber: "",
    email: "",
    class: "",
    section: "",
  });

  // Mock teacher login (in production, implement proper authentication)
  const mockTeacherLogin = async () => {
    try {
      // Check if teacher exists
      const response = await fetch(
        `${API_BASE_URL}/grading/teachers?email=demo@teacher.com`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setTeacher(data.data);
        return data.data;
      } else {
        // Create demo teacher
        const createResponse = await fetch(`${API_BASE_URL}/grading/teachers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Demo Teacher",
            email: "demo@teacher.com",
            password: "demo123",
            subject: "Mathematics",
            school: "Demo School",
          }),
        });
        const createData = await createResponse.json();
        if (createData.success) {
          setTeacher(createData.data);
          return createData.data;
        }
      }
    } catch (error) {
      console.error("Error logging in teacher:", error);
    }
    return null;
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      const teacherData = await mockTeacherLogin();
      if (teacherData) {
        await fetchDashboardStats(teacherData._id);
        await fetchExams(teacherData._id);
        await fetchStudents(teacherData._id);
        await fetchAnswerSheets(teacherData._id);
      }
      setLoading(false);
    };
    initializeDashboard();
  }, []);

  const fetchDashboardStats = async (teacherId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/dashboard?teacherId=${teacherId}`,
      );
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchExams = async (teacherId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/exams?teacherId=${teacherId}`,
      );
      const data = await response.json();
      if (data.success) {
        setExams(data.data);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchStudents = async (teacherId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/students?teacherId=${teacherId}`,
      );
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchAnswerSheets = async (teacherId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grading/answersheets?teacherId=${teacherId}`,
      );
      const data = await response.json();
      if (data.success) {
        setAnswerSheets(data.data);
      }
    } catch (error) {
      console.error("Error fetching answer sheets:", error);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/grading/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newExam,
          teacher: teacher._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setExams([...exams, data.data]);
        setShowExamModal(false);
        setNewExam({
          title: "",
          subject: "",
          description: "",
          totalMarks: 100,
          passingMarks: 33,
          duration: 60,
          questions: [],
        });
      }
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/grading/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStudent,
          teacher: teacher._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStudents([...students, data.data]);
        setShowStudentModal(false);
        setNewStudent({
          name: "",
          rollNumber: "",
          email: "",
          class: "",
          section: "",
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleBulkGrade = async (examId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grading/bulk-grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Graded ${data.data.graded} answer sheets`);
        fetchAnswerSheets(teacher._id);
      }
    } catch (error) {
      console.error("Error bulk grading:", error);
    }
  };

  if (loading) {
    return (
      <div className="grading-dashboard loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="grading-dashboard error">
        <p>Error: Unable to load teacher account</p>
      </div>
    );
  }

  return (
    <div className="grading-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>AI Question Paper Grading System</h1>
          <div className="teacher-info">
            <span>Welcome, {teacher.name}</span>
            <span className="subject-badge">{teacher.subject}</span>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "exams" ? "active" : ""}
          onClick={() => setActiveTab("exams")}
        >
          Exams
        </button>
        <button
          className={activeTab === "students" ? "active" : ""}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
        <button
          className={activeTab === "grading" ? "active" : ""}
          onClick={() => setActiveTab("grading")}
        >
          Grading
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "overview" && dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-tab"
          >
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon exams">📝</div>
                <div className="stat-info">
                  <h3>{dashboardStats.totalExams}</h3>
                  <p>Total Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon students">👥</div>
                <div className="stat-info">
                  <h3>{dashboardStats.totalStudents}</h3>
                  <p>Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pending">⏳</div>
                <div className="stat-info">
                  <h3>{dashboardStats.pendingGrading}</h3>
                  <p>Pending Grading</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon completed">✅</div>
                <div className="stat-info">
                  <h3>{dashboardStats.completedGrading}</h3>
                  <p>Graded</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => setShowExamModal(true)}
                >
                  + Create Exam
                </button>
                <button
                  className="action-btn"
                  onClick={() => setShowStudentModal(true)}
                >
                  + Add Student
                </button>
                <button className="action-btn secondary">
                  Upload Answer Sheets
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              {dashboardStats.recentActivity &&
              dashboardStats.recentActivity.length > 0 ? (
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exam</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.recentActivity.map((activity) => (
                      <tr key={activity._id}>
                        <td>{activity.student?.name || "Unknown"}</td>
                        <td>{activity.exam?.title || "Unknown"}</td>
                        <td>
                          <span
                            className={`status-badge ${activity.grading?.status}`}
                          >
                            {activity.grading?.status}
                          </span>
                        </td>
                        <td>
                          {new Date(activity.uploadedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No recent activity</p>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "exams" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="exams-tab"
          >
            <div className="tab-header">
              <h2>Manage Exams</h2>
              <button
                className="primary-btn"
                onClick={() => setShowExamModal(true)}
              >
                + Create New Exam
              </button>
            </div>

            <div className="exams-grid">
              {exams.map((exam) => (
                <div key={exam._id} className="exam-card">
                  <div className="exam-header">
                    <h3>{exam.title}</h3>
                    <span className="subject-tag">{exam.subject}</span>
                  </div>
                  <div className="exam-details">
                    <p>
                      <strong>Total Marks:</strong> {exam.totalMarks}
                    </p>
                    <p>
                      <strong>Passing Marks:</strong> {exam.passingMarks}
                    </p>
                    <p>
                      <strong>Duration:</strong> {exam.duration} minutes
                    </p>
                    <p>
                      <strong>Questions:</strong> {exam.questions?.length || 0}
                    </p>
                  </div>
                  <div className="exam-actions">
                    <button className="action-btn small">View Details</button>
                    <button
                      className="action-btn small primary"
                      onClick={() => handleBulkGrade(exam._id)}
                    >
                      Grade All
                    </button>
                    <button className="action-btn small secondary">Edit</button>
                  </div>
                </div>
              ))}
              {exams.length === 0 && (
                <div className="no-data">
                  <p>No exams created yet. Create your first exam!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="students-tab"
          >
            <div className="tab-header">
              <h2>Manage Students</h2>
              <button
                className="primary-btn"
                onClick={() => setShowStudentModal(true)}
              >
                + Add Student
              </button>
            </div>

            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.email || "-"}</td>
                    <td>{student.class || "-"}</td>
                    <td>{student.section || "-"}</td>
                    <td>
                      <button className="action-btn small">View</button>
                      <button className="action-btn small secondary">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No students added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === "grading" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grading-tab"
          >
            <div className="tab-header">
              <h2>Answer Sheets Grading</h2>
            </div>

            <div className="grading-filters">
              <select>
                <option value="">All Exams</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title}
                  </option>
                ))}
              </select>
              <select>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            <table className="grading-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {answerSheets.map((sheet) => (
                  <tr key={sheet._id}>
                    <td>
                      <div className="student-cell">
                        <span className="student-name">
                          {sheet.student?.name}
                        </span>
                        <span className="roll-number">
                          {sheet.student?.rollNumber}
                        </span>
                      </div>
                    </td>
                    <td>{sheet.exam?.title}</td>
                    <td>
                      {sheet.grading?.totalMarksObtained !== undefined
                        ? `${sheet.grading.totalMarksObtained}/${sheet.exam?.totalMarks}`
                        : "-"}
                    </td>
                    <td>
                      {sheet.grading?.grade ? (
                        <span
                          className={`grade-badge ${sheet.grading.grade.toLowerCase()}`}
                        >
                          {sheet.grading.grade}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${sheet.grading?.status}`}>
                        {sheet.grading?.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn small">View</button>
                      {sheet.grading?.status === "pending" && (
                        <button className="action-btn small primary">
                          Grade
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {answerSheets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No answer sheets uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="reports-tab"
          >
            <div className="tab-header">
              <h2>Reports & Analytics</h2>
            </div>

            <div className="report-selector">
              <select>
                <option value="">Select Exam for Report</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="report-placeholder">
              <p>Select an exam to view detailed performance analytics</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Create Exam Modal */}
      {showExamModal && (
        <div className="modal-overlay" onClick={() => setShowExamModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Exam</h2>
            <form onSubmit={handleCreateExam}>
              <div className="form-group">
                <label>Exam Title</label>
                <input
                  type="text"
                  value={newExam.title}
                  onChange={(e) =>
                    setNewExam({ ...newExam, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={newExam.subject}
                  onChange={(e) =>
                    setNewExam({ ...newExam, subject: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newExam.description}
                  onChange={(e) =>
                    setNewExam({ ...newExam, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    value={newExam.totalMarks}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        totalMarks: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Passing Marks</label>
                  <input
                    type="number"
                    value={newExam.passingMarks}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        passingMarks: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        duration: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowExamModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowStudentModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Student</h2>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  value={newStudent.rollNumber}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, rollNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <input
                    type="text"
                    value={newStudent.class}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, class: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    value={newStudent.section}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, section: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowStudentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
