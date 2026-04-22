import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AdminPortal from "../components/admin/AdminPortal";
import "./AdminPage.css";

export default function AdminPage() {
  return (
    <div className="admin-container">
      {/* Decorative blobs */}
      <div className="home-blob-1" />
      <div className="home-blob-2" />

      <Header />

      <div className="admin-inner">
        <h1>Admin Portal</h1>
        <AdminPortal />
      </div>

      <Footer />
    </div>
  );
}
