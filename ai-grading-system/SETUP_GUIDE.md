# AI Question Paper Grading System - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd ai-grading-system
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-grading?retryWrites=true&w=majority
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3001

## Project Structure

```
ai-grading-system/
├── src/
│   ├── components/
│   │   ├── TeacherDashboard.jsx    # Main teacher interface
│   │   ├── TeacherDashboard.css
│   │   ├── StudentReport.jsx       # Student report viewer
│   │   ├── StudentReport.css
│   │   ├── AnswerSheetUpload.jsx   # Upload & OCR component
│   │   └── AnswerSheetUpload.css
│   ├── App.jsx                     # Main app with routing
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── api/
│   └── grading.js                  # Backend API (Vercel serverless)
├── public/
│   └── vite.svg                    # Favicon
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

## Key Features Implemented

### 1. Teacher Dashboard

- Create and manage exams
- Add and manage students
- Upload answer sheets with OCR
- View grading progress
- Access detailed reports

### 2. Student Reports

- View all graded exams
- Detailed question-wise breakdown
- AI-generated performance analysis
- Strengths, weaknesses, and recommendations

### 3. AI Grading System

- Keyword matching (40% weight)
- Text similarity using Jaccard index (40% weight)
- Answer length analysis (20% weight)
- Automatic grade calculation (A+ to F)

### 4. Answer Sheet Upload

- Drag & drop image upload
- Simulated OCR processing
- Text extraction and editing
- Automatic answer parsing

## API Endpoints

All endpoints are prefixed with `/api/grading/`

### Teachers

- `GET /teachers` - List all teachers
- `POST /teachers` - Create teacher
- `GET /teachers?id=:id` - Get teacher by ID
- `PUT /teachers?id=:id` - Update teacher
- `DELETE /teachers?id=:id` - Delete teacher

### Exams

- `GET /exams` - List all exams
- `POST /exams` - Create exam
- `GET /exams?teacherId=:id` - Get teacher's exams
- `PUT /exams?id=:id` - Update exam
- `DELETE /exams?id=:id` - Delete exam

### Students

- `GET /students` - List all students
- `POST /students` - Add student
- `GET /students?teacherId=:id` - Get teacher's students
- `PUT /students?id=:id` - Update student
- `DELETE /students?id=:id` - Delete student

### Answer Sheets

- `GET /answersheets` - List all answer sheets
- `POST /answersheets` - Upload answer sheet
- `GET /answersheets?id=:id` - Get single answer sheet
- `PUT /answersheets?id=:id` - Update answer sheet
- `DELETE /answersheets?id=:id` - Delete answer sheet

### Grading

- `POST /grade` - Grade single answer sheet
- `POST /bulk-grade` - Grade all pending sheets for exam

### Reports

- `GET /reports?examId=:id` - Get exam report
- `GET /reports?studentId=:id` - Get student report
- `GET /dashboard?teacherId=:id` - Get dashboard stats

## Database Schema

### Teacher

```javascript
{
  name: String,
  email: String (unique),
  password: String,
  subject: String,
  school: String,
  createdAt: Date
}
```

### Exam

```javascript
{
  teacher: ObjectId (ref: Teacher),
  title: String,
  subject: String,
  description: String,
  totalMarks: Number,
  passingMarks: Number,
  duration: Number,
  questions: [{
    questionNumber: Number,
    questionText: String,
    marks: Number,
    modelAnswer: String,
    keywords: [String]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Student

```javascript
{
  name: String,
  rollNumber: String,
  email: String,
  class: String,
  section: String,
  teacher: ObjectId (ref: Teacher),
  createdAt: Date
}
```

### AnswerSheet

```javascript
{
  student: ObjectId (ref: Student),
  exam: ObjectId (ref: Exam),
  teacher: ObjectId (ref: Teacher),
  images: [{
    url: String,
    ocrText: String,
    uploadedAt: Date
  }],
  extractedText: String,
  answers: [{
    questionNumber: Number,
    studentAnswer: String
  }],
  grading: {
    status: String (pending/processing/completed/reviewed),
    totalMarksObtained: Number,
    percentage: Number,
    grade: String,
    questionWiseMarks: [{
      questionNumber: Number,
      marksObtained: Number,
      maxMarks: Number,
      feedback: String,
      keywordsMatched: [String]
    }],
    gradedAt: Date,
    gradedBy: String (ai/teacher/hybrid)
  },
  aiAnalysis: {
    confidence: Number,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  uploadedAt: Date,
  updatedAt: Date
}
```

## Deployment

### Frontend (Vercel)

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to Vercel

### Backend (Vercel Serverless)

The `api/grading.js` file can be deployed directly to Vercel as a serverless function.

### Environment Variables for Production

Set these in your Vercel project settings:

- `MONGODB_URI` - Your MongoDB connection string

## Testing the Application

### 1. Create a Teacher Account

- The app automatically creates a demo teacher on first run
- Email: demo@teacher.com
- Password: demo123

### 2. Create an Exam

1. Go to Teacher Dashboard
2. Click "Exams" tab
3. Click "+ Create New Exam"
4. Fill in exam details and questions with model answers and keywords

### 3. Add Students

1. Go to "Students" tab
2. Click "+ Add Student"
3. Fill in student details

### 4. Upload Answer Sheet

1. Click "Upload Answer Sheets" button
2. Select exam and student
3. Upload images of answer sheets
4. Review extracted text
5. Submit for grading

### 5. View Reports

1. Go to Student Report page
2. Click on any exam to see detailed analysis

## Customization

### Styling

- Main colors defined in `src/index.css` as CSS variables
- Component-specific styles in `.css` files alongside components

### AI Grading Algorithm

Modify the `checkAnswerWithAI` function in `api/grading.js` to customize:

- Keyword matching weight
- Text similarity algorithm
- Length scoring
- Feedback generation

### OCR Integration

Replace the mock OCR in `AnswerSheetUpload.jsx` with actual OCR service:

- Google Vision API
- AWS Textract
- Azure Computer Vision

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, change it in `vite.config.js`:

```javascript
server: {
  port: 3002, // Change to desired port
}
```

### MongoDB Connection Issues

- Check your MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user has proper permissions

### API Not Responding

- Ensure backend is deployed and accessible
- Check CORS settings in `api/grading.js`
- Verify environment variables are set correctly

## Next Steps

1. **Add Authentication**: Implement proper login/signup
2. **Real OCR**: Integrate with actual OCR service
3. **File Upload**: Add actual image upload to cloud storage
4. **Email Notifications**: Send grades via email
5. **Export Results**: Download reports as PDF
6. **Mobile App**: Create React Native version

## Support

For issues and questions:

- Check the README.md
- Review API endpoint documentation
- Inspect browser console for errors
- Verify MongoDB connection

## License

MIT License - Feel free to use and modify for your needs!
