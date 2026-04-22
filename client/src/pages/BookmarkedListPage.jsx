import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./BookmarkedListPage.css";

export default function BookmarkedListPage() {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const removeBookmark = (mongoId) => {
    const updated = bookmarks.filter((item) => item._id !== mongoId);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };
  return (
    <div className="bookmark-container">
      <div className="home-blob-1" />
      <div className="home-blob-2" />
      <Header />

      <main className="bookmark-inner">
        <div className="bookmark-section">
          <center>
            <h1>Your Bookmarks</h1>
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
                <div key={resource._id} className="bookmark-item">
                  <div style={{ flex: 1 }}>
                    {/* THIS IS THE LINK: It wraps the title so you can click it */}
                    <Link
                      to={`/resource/${resource._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: "1.1rem",
                          marginBottom: "4px",
                        }}
                      >
                        {resource.title}
                      </strong>
                    </Link>
                    <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      {resource.type}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
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
