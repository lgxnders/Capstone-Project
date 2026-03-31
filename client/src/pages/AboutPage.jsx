import { Link } from "react-router-dom";
import "./AboutPage.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function AboutPage() {
    const guides = [
        { title: "Anxiety Guide", file: "/guides/anxiety-guide.pdf" },
        { title: "Depression Guide", file: "/guides/depression-guide.pdf" },
        { title: "Panic Attack Guide", file: "/guides/panic-attack-guide.pdf" },
        { title: "Stress Management Guide", file: "/guides/stress-management-guide.pdf" },
    ];

    return (
        <div className="about-container">
            <div className="home-blob-1" />
            <div className="home-blob-2" />
            <Header />

            <main className="about-inner">
                <section className="about-hero">
                    <h1>About Care Compass</h1>
                    <p>
                        Care Compass is a mental health support platform designed to help people
                        find guidance, support, and trusted resources during difficult moments.
                        Mental health support can often feel overwhelming or hard to navigate,
                        so we created a space that feels supportive, calm, and easy to use.
                    </p>
                    <p>
                        Through simple conversations with our chatbot, users can explore what
                        they are feeling and receive relevant resources such as crisis support,
                        wellness tools, and mental health information in a compassionate and
                        non-judgmental environment.
                    </p>
                </section>

                <section className="how-it-works-section">
                    <h2>How It Works</h2>
                    <p>
                        Care Compass turns mental health support into a simple chat-based
                        experience:
                    </p>

                    <ul className="feature-list">
                        <li className="feature-item">
                            <strong>Let it out:</strong> Users can talk about their feelings,
                            challenges, or current mental state in a natural and conversational way.
                        </li>
                        <li className="feature-item">
                            <strong>Understand the situation:</strong> Care Compass asks helpful
                            follow-up questions to better understand the user’s needs and context.
                        </li>
                        <li className="feature-item">
                            <strong>Receive guidance:</strong> Based on the conversation, the
                            platform suggests relevant resources and support options tailored to
                            the user.
                        </li>
                    </ul>
                </section>

                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        Our goal is to make mental health support more accessible, approachable,
                        and organized. We want users to feel heard and guided rather than left to
                        search through overwhelming information on their own.
                    </p>
                </section>

                <section className="guides-section">
                    <h2>Downloadable Quick Guides</h2>
                    <p>
                        We also provide downloadable guides that users can keep for offline use.
                        These may be especially helpful during stressful moments when quick access
                        to coping strategies and mental health information matters most.
                    </p>

                    <div className="guide-grid">
                        {guides.map((guide) => (
                            <a
                                key={guide.title}
                                href={guide.file}
                                download
                                className="guide-card"
                            >
                                <h3>{guide.title}</h3>
                                <p>Download PDF</p>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="privacy-section">
                    <h2>Privacy and Care</h2>
                    <p>
                        We understand that mental health is personal. Care Compass is designed
                        with privacy, respect, and user trust in mind. Our aim is to create a
                        safe and supportive environment where users can seek help more comfortably.
                    </p>
                </section>

                <section className="disclaimer-section">
                    <h2>Important Note</h2>
                    <p>
                        Care Compass is intended to support users by providing mental health
                        resources and guidance, but it is not a replacement for professional
                        medical advice, diagnosis, or treatment. If you are in immediate crisis,
                        please contact emergency services or a licensed mental health professional.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}