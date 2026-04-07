import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('authchange'));
    navigate("/login");
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header-inner">

        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <span className="header-logo-icon">✦</span>
          Care Compass
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav">
          <Link to="/chat" className="header-link">Chatbot</Link>
          <Link to="/about" className="header-link">About</Link>
          {isAdmin && <Link to="/admin" className="header-link">Admin</Link>}
          <div className="header-divider" />
          {isLoggedIn ? (
            <button onClick={handleLogout} className="header-cta">Logout</button>
          ) : (
            <>
              <Link to="/register" className="header-link">Register</Link>
              <Link to="/login" className="header-cta">Login</Link>
            </>
          )}
        </nav>

        {/* Hamburger */}
        <button
          className={`header-hamburger ${menuOpen ? "header-hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`header-mobile-menu ${menuOpen ? "header-mobile-menu--open" : ""}`}>
        <Link to="/chat" className="header-mobile-link" onClick={closeMenu}>Chatbot</Link>
        <Link to="/about" className="header-mobile-link" onClick={closeMenu}>About</Link>
        {isAdmin && <Link to="/admin" className="header-mobile-link" onClick={closeMenu}>Admin</Link>}
        {!isLoggedIn && (
          <>
            <Link to="/register" className="header-mobile-link" onClick={closeMenu}>Register</Link>
            <Link to="/login" className="header-mobile-link header-mobile-cta" onClick={closeMenu}>Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;