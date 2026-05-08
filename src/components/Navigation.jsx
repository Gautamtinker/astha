import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navigation.css";

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/gallery", label: "Gallery", icon: "📸" },
  { path: "/timeline", label: "Timeline", icon: "⏰" },
  { path: "/quiz", label: "Quiz", icon: "💕" },
  { path: "/notebook", label: "Notebook", icon: "📝" },
  { path: "/messages", label: "Messages", icon: "💌" },
  { path: "/surprise", label: "Surprise", icon: "🎁" },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo-heart">❤️</span>
          <span>Astha & Love</span>
        </NavLink>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
