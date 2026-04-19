import { Link } from "react-router-dom";
import {
  MessageCircle,
  Compass,
  Bookmark,
  Lock,
  Heart,
  Zap,
  ArrowRight,
} from "lucide-react";
import "./HomePage.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const TEAM = [
  {
    name: "Laksh Jairam",
    role: "Frontend Developer",
    bio: "Focused on crafting intuitive user interfaces and smooth animations that make Care Compass feel welcoming and calm.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=450&fit=crop&crop=faces",
  },
  {
    name: "Noah Go",
    role: "Frontend Developer",
    bio: "Specializes in React component architecture and building accessible, responsive layouts across the application.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&crop=faces",
  },
  {
    name: "Nana Prempeh",
    role: "Frontend Developer",
    bio: "Brings the visual design to life, implementing polished UI patterns and ensuring a consistent design language throughout.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=450&fit=crop&crop=faces",
  },
  {
    name: "Abdimalik Abokar",
    role: "Backend Developer",
    bio: "Architected the Node.js + TypeScript backend, handling API routes, authentication, and MongoDB integration.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=450&fit=crop&crop=faces",
  },
  {
    name: "Joshua Subray",
    role: "Backend Developer",
    bio: "Owns the chatbot integration pipeline and real-time conversation logic, connecting the AI agents to the user interface.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=450&fit=crop&crop=faces",
  },
  {
    name: "Alexander Stasyna",
    role: "Backend Developer",
    bio: "Designed the resource and user data models, and built the controller layer powering Care Compass's core features.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=450&fit=crop&crop=faces",
  },
];

export default function HomePage() {
  return (
    <div className="home-container">
      {/* ── Atmospheric blobs ── */}
      <div className="home-blob-1" />
      <div className="home-blob-2" />
      <div className="home-blob-3" />

      <Header />

      {/* ══════════════════ Hero ══════════════════ */}
      <main className="home-inner">

        <div className="home-eyebrow">
          <span className="home-eyebrow-dot" />
          Mental Health Support
        </div>

        <h1 className="home-headline">
          You don't have to navigate
          <br />
          this <em>alone</em>
        </h1>

        <p className="home-subheadline">
          Care Compass connects you with trusted mental health resources,
          guided conversations, and compassionate support — whenever you
          need it most.
        </p>

        <div className="home-cta-group">
          <Link to="/chat" className="home-cta-primary">
            Start a conversation
            <ArrowRight className="home-cta-icon" size={18} strokeWidth={2.5} />
          </Link>
          <Link to="/about" className="home-cta-secondary">
            Learn how it works
          </Link>
        </div>

        {/* Feature cards */}
        <div className="home-features">
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap">
              <MessageCircle size={22} strokeWidth={1.75} className="home-feature-svg" />
            </div>
            <h3>Talk it through</h3>
            <p>Share what you're feeling in a safe, non-judgmental space. Our chatbot listens and understands.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap">
              <Compass size={22} strokeWidth={1.75} className="home-feature-svg" />
            </div>
            <h3>Get guided</h3>
            <p>Receive personalized resources, crisis support links, and wellness tools tailored to your situation.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap">
              <Bookmark size={22} strokeWidth={1.75} className="home-feature-svg" />
            </div>
            <h3>Save &amp; revisit</h3>
            <p>Bookmark helpful resources and revisit past conversations whenever you need a reminder.</p>
          </div>
        </div>

        {/* Trust strip */}
        <div className="home-trust">
          <span className="home-trust-item">
            <Lock size={14} strokeWidth={2} className="home-trust-svg" />
            Private &amp; secure
          </span>
          <span className="home-trust-divider" />
          <span className="home-trust-item">
            <Heart size={14} strokeWidth={2} className="home-trust-svg" />
            Judgment-free
          </span>
          <span className="home-trust-divider" />
          <span className="home-trust-item">
            <Zap size={14} strokeWidth={2} className="home-trust-svg" />
            Available anytime
          </span>
        </div>

      </main>

      {/* ══════════════════ Meet the Team ══════════════════ */}
      <section className="home-team">
        <div className="home-team-inner">

          <div className="home-team-header">
            <div className="home-eyebrow home-eyebrow--centered">
              <span className="home-eyebrow-dot" />
              The people behind it
            </div>
            <h2 className="home-team-headline">Meet the team</h2>
            <p className="home-team-sub">
              Care Compass was built by six students from Humber Polytechnic's
              Computer Programming &amp; Analysis program.
            </p>
          </div>

          <div className="home-team-grid">
            {TEAM.map((member) => (
              <div className="home-team-card" key={member.name}>
                <div className="home-team-avatar-wrap">
                  <img
                    src={member.avatar}
                    alt={`Photo of ${member.name}`}
                    className="home-team-avatar"
                    loading="lazy"
                  />
                </div>
                <div className="home-team-card-body">
                  <p className="home-team-role">{member.role}</p>
                  <h3 className="home-team-name">{member.name}</h3>
                  <p className="home-team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}