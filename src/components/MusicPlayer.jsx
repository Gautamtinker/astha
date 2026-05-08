import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Using a royalty-free romantic background music
  // You can replace this URL with your own audio file
  const audioUrl =
    "https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde668d05.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3; // Set initial volume to 30%

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <button
        className={`music-control ${isPlaying ? "playing" : ""}`}
        onClick={togglePlay}
        title={isPlaying ? "Pause Music" : "Play Music"}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
    </>
  );
}

export default MusicPlayer;
