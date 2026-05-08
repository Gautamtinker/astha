import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import "./Timeline.css";

// Timeline events - Customize these with your own story
const timelineEvents = [
  {
    id: 1,
    title: "First Meet",
    date: "February 15, 2026",
    description:
      "The day our eyes met for the first time. It felt like the world stopped spinning and all I could see was you. That magical moment changed everything.",
    icon: "💕",
    color: "#e91e63",
  },
  {
    id: 2,
    title: "First Conversation",
    date: "February 15, 2026",
    description:
      "We finally started talking. Every word felt special, every message made my heart race. I knew there was something beautiful beginning.",
    icon: "💬",
    color: "#7b1fa2",
  },
  {
    id: 3,
    title: "Said I Love You",
    date: "February 28, 2026",
    description:
      "It all started with an Instagram reel I sent you. After watching it, you smiled and said, 'Aise bologe?' — and then, for the very first time, you said 'I love you.' My heart completely stopped in that moment, and right after that, I finally said it too. A memory I’ll cherish forever ❤️",
    icon: "❤️",
    color: "#880e4f",
  },
  {
    id: 4,
    title: "Sending Pic for Celebrating Holi",
    date: "March 4, 2026",
    description:
      "That colorful Holi picture you sent made my entire day special. Seeing your smile covered in colors felt like happiness itself. In that moment, even through a picture, I felt closer to you than ever before ❤️🎨",
    icon: "🌈",
    color: "#6a1b9a",
  },
  {
    id: 5,
    title: "Our Roka Day",
    date: "March 28, 2026",
    description:
      "The day our bond became even more special — our roka. Seeing you beside me, surrounded by happiness and family, felt like a dream come true. That moment marked the beginning of forever for us ❤️💍",
    icon: "💖",
    color: "#4a148c",
  },
  {
    id: 6,
    title: "Our First Coffee Date",
    date: "March 29, 2026",
    description:
      "The excitement, the nervous smiles, and the happiness of finally going on our first Coffee date together — every second felt magical. Walking beside you, talking endlessly, and creating our own little memories made it one of the most beautiful days of my life ❤️✨",
    icon: "🌹",
    color: "#e91e63",
  },
  {
    id: 7,
    title: "My Birthday Surprise",
    date: "April 19, 2026",
    description:
      "The way you made my birthday so special will always stay close to my heart. From sending me a sweet cake to your beautiful wishes, every little thing made me feel truly loved. That day wasn’t just my birthday — it became one of my favorite memories because of you ❤️🎂✨",
    icon: "🎉",
    color: "#e91e63",
  },
];

function Timeline() {
  return (
    <div className="timeline-page">
      <div className="timeline-container">
        <motion.div
          className="timeline-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Our Love Story Timeline ⏰</h1>
          <p>Every moment with you is a precious memory</p>
        </motion.div>

        <div className="timeline">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const isEven = index % 2 === 0;

  const variants = {
    hidden: {
      opacity: 0,
      x: isEven ? -100 : 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`timeline-item ${isEven ? "left" : "right"}`}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      <div className="timeline-content glass-card">
        <div className="timeline-icon" style={{ backgroundColor: event.color }}>
          {event.icon}
        </div>
        <div className="timeline-date">{event.date}</div>
        <h3 className="timeline-title">{event.title}</h3>
        <p className="timeline-description">{event.description}</p>
      </div>
    </motion.div>
  );
}

export default Timeline;
