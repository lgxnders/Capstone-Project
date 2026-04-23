import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./BookmarkedListPage.css";

export default function BookmarkedListPage() {
  const { user } = useAuth();

  // Create the same dynamic key
  const bookmarkLoginKey = user ? `bookmarks_${user.userId}` : "bookmarks_user";

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem(bookmarkLoginKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Re-sync bookmarks if the user changes
  useEffect(() => {
    const saved = localStorage.getItem(bookmarkLoginKey);
    const parsed = saved ? JSON.parse(saved) : [];
    setBookmarks(parsed);
  }, [bookmarkLoginKey]);

  const removeBookmark = (mongoId) => {
    const updated = bookmarks.filter((item) => item._id !== mongoId);
    setBookmarks(updated);
    localStorage.setItem(bookmarkLoginKey, JSON.stringify(updated));
  };

  const truncateDescription = (text) => {
    if (!text) return "";
    const sentences = text.split(". ");
    if (sentences.length <= 3) return text;
    return sentences.slice(0, 3).join(". ") + "...";
  };

  return (
    <div className="bookmark-container">
      <div className="home-blob-1" />
      <div className="home-blob-2" />
      <Header />

      <main className="bookmark-inner">
        <div className="bookmark-section">
          <center>
            <h1 style={{ marginBottom: "20px" }}>Your Bookmarks</h1>
          </center>

          <div className="bookmark-list">
            {bookmarks.length === 0 ? (
              <p
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No bookmarks found
              </p>
            ) : (
              bookmarks.map((resource) => (
                <div
                  key={resource._id}
                  className="bookmark-item"
                  style={{ flexDirection: "column", alignItems: "flex-start" }}
                >
                  <div style={{ width: "100%", marginBottom: "12px" }}>
                    <Link
                      to={`/resource/${resource._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: "1.2rem",
                          color: "#1f2937",
                          marginBottom: "4px",
                        }}
                      >
                        {resource.title}
                      </strong>
                    </Link>

                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#7c3aed",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      {resource.type}
                    </span>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#4b5563",
                        lineHeight: "1.5",
                        margin: "0",
                      }}
                    >
                      {truncateDescription(resource.description)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link
                      to={`/resources/${resource._id}`}
                      className="bookmark-link"
                    >
                      View Page
                    </Link>

                    <button
                      className="bookmark-remove"
                      onClick={() => removeBookmark(resource._id)}
                    >
                      Unbookmark
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
