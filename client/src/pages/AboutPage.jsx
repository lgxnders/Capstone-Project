import "./AboutPage.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function AboutPage() {
    return (
        <div className="about-container">
            <div className="home-blob-1" />
            <div className="home-blob-2" />
            
            <Header />

            <main className="about-inner">
                <section className="about-hero">
                    <div className="badge">Our Purpose</div>
                    <h1>About Care Compass</h1>
                    <p className="lead-text">
                        Care Compass is a mental health support platform designed to help people
                        find guidance, support, and trusted resources during difficult moments.
                    </p>
                    <p>
                        Mental health support can often feel overwhelming or hard to navigate,
                        so we created a space that feels supportive, calm, and easy to use.
                        Through simple conversations with our chatbot, users can explore what
                        they are feeling and receive relevant resources such as crisis support,
                        wellness tools, and mental health information in a compassionate and
                        non-judgmental environment.
                    </p>
                </section>

                <section className="how-it-works-section">
                    <h2>How It Works</h2>
                    <p className="section-intro">
                        Care Compass turns mental health support into a simple chat-based experience:
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <div className="feature-icon">💬</div>
                            <strong>Let it out</strong>
                            <p>Talk about your feelings, challenges, or current mental state in a natural, conversational way.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🧠</div>
                            <strong>Understand the situation</strong>
                            <p>Care Compass asks helpful follow-up questions to better understand your needs and context.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🧭</div>
                            <strong>Receive guidance</strong>
                            <p>Based on the conversation, the platform suggests relevant resources and support options tailored to you.</p>
                        </div>
                    </div>
                </section>

                <div className="info-split">
                    <section className="mission-section glass-panel">
                        <h2>Our Mission</h2>
                        <p>
                            Our goal is to make mental health support more accessible, approachable,
                            and organized. We want users to feel heard and guided rather than left to
                            search through overwhelming information on their own.
                        </p>
                    </section>

                    <section className="privacy-section glass-panel">
                        <h2>Privacy and Care</h2>
                        <p>
                            We understand that mental health is personal. Care Compass is designed
                            with privacy, respect, and user trust in mind. Our aim is to create a
                            safe and supportive environment where users can seek help comfortably.
                        </p>
                    </section>
                </div>

                <section className="disclaimer-section">
                    <div className="disclaimer-content">
                        <h2>⚠️ Important Note</h2>
                        <p>
                            Care Compass is intended to support users by providing mental health
                            resources and guidance, but it is not a replacement for professional
                            medical advice, diagnosis, or treatment. If you are in immediate crisis,
                            please contact emergency services or a licensed mental health professional.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}