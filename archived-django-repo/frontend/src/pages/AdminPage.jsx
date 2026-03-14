import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./AdminPage.css";

export default function AdminPage() {
  return (
    <div className="admin-container">
      <Header />
      <div className="admin-inner">
        <h1 style={{ marginBottom: 6 }}>Admin Portal</h1>
        <p style={{ marginTop: 0, color: "#444" }}>Welcome back, Administrator.</p>

        <div className="admin-link-wrapper">
          <Link to="/chat" className="admin-link">
            Open Chatbot
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
