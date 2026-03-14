//Header coponent with navigation links to different pages
//Not all pages linked in the header are created yet but assuming they will be in the future
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <Link to="/">Care Compass</Link>
    </h1>
      <nav>
        <Link to="/chat">Chatbot</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/about">About Care Compass</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
