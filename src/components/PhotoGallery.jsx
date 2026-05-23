import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PhotoGallery.css";
import astha1 from "../Photos/astha1.jpeg";
import astha2 from "../Photos/astha2.jpeg";
import astha3 from "../Photos/astha3.jpeg";
import astha5 from "../Photos/astha5.jpeg";
import astha6 from "../Photos/astha6.jpeg";
import astha7 from "../Photos/astha7.jpeg";
import astha9 from "../Photos/astha9.jpeg";
import astha10 from "../Photos/astha10.jpeg";
import astha11 from "../Photos/astha11.jpeg";
import astha12 from "../Photos/astha12.jpeg";
// Sample photos - Replace these with your actual photos
const samplePhotos = [
  {
    id: 1,
    url: astha1,
    caption: "Our First Meet ✨",
    date: "Feb 15, 2026",
  },
  {
    id: 2,
    url: astha2,
    caption: "Pure love in one frame 💕",
    date: "Mar 4, 2026",
  },
  {
    id: 3,
    url: astha3,
    caption: "Her cutest version ever 🥹",
    date: "Mar 4, 2026",
  },
  {
    id: 4,
    url: astha6,
    caption: "Her Childhood memories 💕",
    date: "Apr 2, 2026",
  },
  {
    id: 5,
    url: astha7,
    caption: "Bacha Party with Her Bhuha🤝",
    date: "Apr 2, 2026",
  },
  {
    id: 6,
    url: astha5,
    caption: "Coffee Dates ☕",
    date: "Mar 29, 2026",
  },
  {
    id: 7,
    url: astha10,
    caption: "My cutiee , laddo , mera bacha",
    date: "Jan 2, 2004",
  },
  {
    id: 8,
    url: astha9,
    caption: "My Birthday Celebration by her",
    date: "Apr 19, 2026",
  },
  {
    id: 9,
    url: astha11,
    caption: "Finally its Roka 💕",
    date: "Mar 28, 2026",
  },
  {
    id: 10,
    url: astha12,
    caption: "My First Gift to Her 💕",
    date: "Mar 28, 2026",
  },
];

function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const showPrevious = () => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : samplePhotos.length - 1;
    setSelectedPhoto(samplePhotos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const showNext = () => {
    const newIndex =
      currentIndex < samplePhotos.length - 1 ? currentIndex + 1 : 0;
    setSelectedPhoto(samplePhotos[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Our Photo Gallery 📸</h1>
          <p>Every picture tells a story of our love</p>
        </motion.div>

        <div className="gallery-grid">
          {samplePhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              onClick={() => openLightbox(photo, index)}
            >
              <div className="photo-frame">
                <img src={photo.url} alt={photo.caption} loading="lazy" />
                <div className="photo-overlay">
                  <span className="photo-caption">{photo.caption}</span>
                  <span className="photo-date">{photo.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>
                ✕
              </button>
              <button className="lightbox-nav prev" onClick={showPrevious}>
                ❮
              </button>
              <div className="lightbox-image-container">
                <img src={selectedPhoto.url} alt={selectedPhoto.caption} />
              </div>
              <button className="lightbox-nav next" onClick={showNext}>
                ❯
              </button>
              <div className="lightbox-caption">
                <h3>{selectedPhoto.caption}</h3>
                <p>{selectedPhoto.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhotoGallery;
