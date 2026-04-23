import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchResourceById } from "../services/api";
import useAuth from "../hooks/useAuth";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState("");

  // Create a dynamic key
  // If not logged in, we fall back to "guest" or just don't allow saving
  const bookmarkLoginKey = user ? `bookmarks_${user.userId}` : "bookmarks_user";

  useEffect(() => {
    const getResource = async () => {
      try {
        const data = await fetchResourceById(id);
        setResource(data);
        
        // Use the user-specific key to check bookmark status
        const savedBookmarks = JSON.parse(localStorage.getItem(bookmarkLoginKey) || "[]");
        const isBookmarked = savedBookmarks.some((item) => item._id === id);
        setBookmarked(isBookmarked);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getResource();
  }, [id, bookmarkLoginKey]); // Re-run if bookmarkLoginKey changes (user logs in/out)

  const handleBookmarkToggle = () => {
    if (!isLoggedIn) {
      alert("Please log in to save bookmarks to your account.");
      return;
    }

    let savedBookmarks = JSON.parse(localStorage.getItem(bookmarkLoginKey) || "[]");

    if (bookmarked) {
      savedBookmarks = savedBookmarks.filter((item) => item._id !== id);
    } else {
      savedBookmarks.push(resource);
    }

    localStorage.setItem(bookmarkLoginKey, JSON.stringify(savedBookmarks));
    setBookmarked(!bookmarked);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        Error: {error}
      </div>
    );
  if (!resource) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
        position: "relative", 
        overflow: "hidden",   
      }}
    >
      <div className="home-blob-1" />
      <div className="home-blob-2" />
    
      <Header />
      <main
        style={{
          flex: 1,
          maxWidth: "800px",
          margin: "40px auto",
          padding: "32px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          width: "90%",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#4f46e5",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          &larr; Back
        </Link>

        <h1 style={{ marginTop: "24px", color: "#1f2937" }}>
          {resource.title}
        </h1>
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <span
            style={{
              background: "#ede9fe",
              color: "#7c3aed",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.875rem",
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {resource.type}
          </span>
          {resource.timeEstimate && (
            <span
              style={{
                background: "#f3f4f6",
                color: "#4b5563",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              {resource.timeEstimate} min read
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.7",
            color: "#4b5563",
            marginBottom: "32px",
          }}
        >
          {resource.description}
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Visit Resource
          </a>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              border: bookmarked ? "2px solid #7c3aed" : "2px solid #e5e7eb",
              background: bookmarked
                ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                : "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: bookmarked ? "white" : "#4b5563",
              transition: "all 0.2s ease",
            }}
            onClick={handleBookmarkToggle}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={bookmarked ? "white" : "none"}
              stroke={bookmarked ? "white" : "currentColor"}
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}