# AI Question Paper Grading System

An automated question paper grading system that uses AI to evaluate student answer sheets.

## Features

- **Teacher Dashboard**: Create exams, manage students, upload answer sheets
- **Student Reports**: View graded answer sheets with detailed analytics
- **OCR Integration**: Extract text from uploaded answer sheet images
- **AI Grading**: Automatic evaluation based on keywords and answer similarity
- **Performance Analytics**: Detailed question-wise breakdown and AI-generated insights

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js (Serverless functions)
- **Database**: MongoDB
- **Styling**: CSS3 with Framer Motion animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB account (for database)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## Project Structure

```
ai-grading-system/
├── src/
│   ├── components/
│   │   ├── TeacherDashboard.jsx    # Teacher dashboard component
│   │   ├── TeacherDashboard.css
│   │   ├── StudentReport.jsx       # Student report component
│   │   ├── StudentReport.css
│   │   ├── AnswerSheetUpload.jsx   # Answer sheet upload with OCR
│   │   └── AnswerSheetUpload.css
│   ├── App.jsx                     # Main app component
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── api/
│   └── grading.js                  # Backend API for grading
├── package.json
├── vite.config.js
└── index.html
```

## API Endpoints

### Teachers

- `GET /api/grading/teachers` - Get all teachers
- `POST /api/grading/teachers` - Create new teacher
- `GET /api/grading/teachers?id=:id` - Get teacher by ID

### Exams

- `GET /api/grading/exams` - Get all exams
- `POST /api/grading/exams` - Create new exam
- `GET /api/grading/exams?teacherId=:id` - Get exams by teacher

### Students

- `GET /api/grading/students` - Get all students
- `POST /api/grading/students` - Add new student
- `GET /api/grading/students?teacherId=:id` - Get students by teacher

### Answer Sheets

- `POST /api/grading/answersheets` - Upload answer sheet
- `GET /api/grading/answersheets?teacherId=:id` - Get answer sheets by teacher
- `GET /api/grading/answersheets?id=:id` - Get single answer sheet

### Grading

- `POST /api/grading/grade` - Grade an answer sheet
- `POST /api/grading/bulk-grade` - Grade all pending sheets for an exam

### Reports

- `GET /api/grading/reports?examId=:id` - Get exam report
- `GET /api/grading/reports?studentId=:id` - Get student report
- `GET /api/grading/dashboard?teacherId=:id` - Get teacher dashboard stats

## Usage

### For Teachers

1. **Create an Exam**: Go to the Exams tab and click "Create New Exam"
2. **Add Students**: Go to the Students tab and add your students
3. **Upload Answer Sheets**: Click "Upload Answer Sheets" and select exam, student, and images
4. **Auto Grade**: The system will automatically extract text and grade the answers
5. **View Reports**: Check the Reports tab for detailed analytics

### For Students

1. **View Reports**: Go to the Student Reports page
2. **Check Performance**: Click on any exam to see detailed breakdown
3. **Review AI Analysis**: See strengths, weaknesses, and recommendations

## AI Grading Algorithm

The system uses a combination of:

- **Keyword Matching**: Checks for important keywords in the answer
- **Text Similarity**: Jaccard similarity between student and model answers
- **Length Analysis**: Ensures answers are of appropriate length
- **Confidence Scoring**: Provides a confidence score for each grade

## Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy the dist folder to Vercel
```

### Backend (Vercel Serverless)

The `api/` folder contains serverless functions that can be deployed to Vercel.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
