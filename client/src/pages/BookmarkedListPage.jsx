import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./BookmarkedListPage.css";

export default function BookmarkedListPage() {
  return (
    <div className="bookmark-container">
      <Header />

      <main className="bookmark-inner">
        <div className="bookmark-section">
          <h1>Your Bookmarks</h1>
          <div className="bookmark-list">
            <div className="bookmark-item">
              <div>
                <strong style={{ display: "block" }}></strong>
                <span>This is where the resource will be displayed</span>
              </div>
              <button className="bookmark-remove">Unbookmark</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
