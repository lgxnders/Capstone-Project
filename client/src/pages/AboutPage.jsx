import { Link } from "react-router-dom";
import "./AboutPage.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function AboutPage() {
    return (
        <div className="about-container">
            <div className="home-blob-1"/>
            <div className="home-blob-2"/>
            <Header />
            <main className="about-inner">
                <section>
                    <h1>About Us</h1>
                    <p>
                        Care Compass is a service to aid people through their toughest times 
                        with compassion, empathy, and support. Mental health support is often 
                        fragmented and overwhelming; through Care Compass, we have designed 
                        a platform to simplify the journey to wellness.
                    </p>
                    <p>
                        Through simple, supportive conversations with our chatbot, you will be 
                        guided toward the right resources to aid you during tough times. Whether 
                        you need local clinics, crisis support, or wellness tools. With 
                        Care Compass you can find the help you need in a supportive, empathetic, non-judgmental environment.
                    </p>
                </section>

                <section className="how-it-works-section">
                    <h1>How it Works</h1>
                    <p>Care Compass is built to turn mental health support into a supportive, chat-driven interface:</p>
                    <ul className="feature-list">
                        <li className="feature-item">
                            <strong>Let it out:</strong> Users can express their feelings, 
                            challenges, or mental state in a conversational manner.
                        </li>
                        <li className="feature-item">
                            <strong>Connection:</strong> Care Compass uses its resources to 
                            analyze user input and ask background questions to establish context 
                            and pinpoint specific needs.
                        </li>
                        <li className="feature-item">
                            <strong>Guidance:</strong> Through the conversation, the 
                            AI undergoes a process of refinement to better understand the user's 
                            needs and provide more accurate recommendations.
                        </li>
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
}