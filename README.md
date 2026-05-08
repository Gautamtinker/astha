# 💕 I Love You Astha - A Romantic Website

A beautiful, modern, and romantic website created with love for Astha. This website features smooth animations, a photo gallery, love story timeline, romantic quiz, love notebook, messages, and surprise sections.

## ✨ Features

### 🏠 Landing Page

- Beautiful animated hearts floating in the background
- Romantic title and subtitle
- Live counter showing days together
- Soft UI with glass-morphism effects
- Background music player

### 📸 Photo Gallery

- Grid layout with hover effects
- Lightbox preview with navigation
- Captions for each photo
- Smooth animations

### ⏰ Love Story Timeline

- Scroll-triggered animations
- Key moments in your relationship
- Beautiful gradient colors
- Responsive design

### 💕 Love Quiz

- Fun romantic questions
- Correct answer rewards (kisses!)
- Wrong answer encouragement
- Score tracking with rewards

### 📝 Love Notebook

- Write and save love notes
- Edit and delete notes
- Search functionality
- Data persists in localStorage
- Beautiful notebook-style UI

### 💌 Messages

- Send loving messages
- Auto-reply feature
- Messages saved permanently
- Chat-style interface

### 🎁 Surprise Section

- Click for random romantic messages
- Confetti animations
- Special surprises after multiple clicks
- Extra love cards

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**

   ```bash
   cd astha-love-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will be available at `http://localhost:3000`
   - It should open automatically

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
astha-love-website/
├── public/
│   └── heart.svg           # Favicon
├── src/
│   ├── components/
│   │   ├── FloatingHearts.jsx/css    # Floating hearts animation
│   │   ├── LandingPage.jsx/css       # Home page
│   │   ├── LoveNotebook.jsx/css      # Notes section
│   │   ├── Messages.jsx/css          # Messages section
│   │   ├── MusicPlayer.jsx/css       # Background music
│   │   ├── Navigation.jsx/css        # Navigation bar
│   │   ├── PhotoGallery.jsx/css      # Photo gallery
│   │   ├── Quiz.jsx/css              # Love quiz
│   │   ├── Surprise.jsx/css          # Surprise section
│   │   └── Timeline.jsx/css          # Love story timeline
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # App styles
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Entry point
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── README.md                         # This file
```

## 🎨 Customization

### Adding Your Photos

Edit `src/components/PhotoGallery.jsx` and replace the sample photos with your own:

```javascript
const samplePhotos = [
  {
    id: 1,
    url: "path/to/your/photo1.jpg",
    caption: "Your caption here",
    date: "Date",
  },
  // Add more photos...
];
```

### Customizing Timeline Events

Edit `src/components/Timeline.jsx` and modify the `timelineEvents` array with your own story.

### Changing Quiz Questions

Edit `src/components/Quiz.jsx` and update the `quizQuestions` array.

### Modifying Surprise Messages

Edit `src/components/Surprise.jsx` and update the `surpriseMessages` array.

### Background Music

The music player uses a royalty-free track. To use your own audio:

1. Add your audio file to the `public/` folder
2. Update the `audioUrl` in `src/components/MusicPlayer.jsx`

## 🎯 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Framer Motion** - Animations
- **CSS3** - Styling with modern effects

## 📱 Responsive Design

The website is fully responsive and works on:

- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 💡 Tips for Use

1. **Personalize it**: Add your real photos, dates, and memories
2. **Music**: Add a song that's special to both of you
3. **Notes**: Write heartfelt messages in the Love Notebook
4. **Quiz**: Create questions that are meaningful to your relationship
5. **Share**: Send her the link or host it online

## 🌐 Deployment

You can deploy this website for free using:

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Connect your repository on Netlify
3. Deploy!

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

## 💝 Made with Love

This website was created as a special gift for Astha. Feel free to use and modify it for your own loved one!

---

**Remember**: The most important thing is the love and effort you put into it. ❤️

## 📄 License

This project is open source and available for personal use.

---

_For any questions or issues, feel free to reach out!_
