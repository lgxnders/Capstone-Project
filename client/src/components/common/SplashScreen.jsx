import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import robotAnimation from "../../assets/roboHello.json";
import "./SplashScreen.css";

const SplashScreen = ({ onFinished }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out at 3s, fully unmounted by 3.5s
    const fadeTimer = setTimeout(() => setFading(true), 3000);
    const doneTimer = setTimeout(() => onFinished(), 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div className={`splash ${fading ? "splash--fading" : ""}`}>
      <div className="splash-blob-1" />
      <div className="splash-blob-2" />

      <div className="splash-content">
        <div className="splash-lottie">
          <Lottie
            animationData={robotAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
        <div className="splash-text">
          <h1 className="splash-title">Care Compass</h1>
          <p className="splash-subtitle">Your mental wellness, guided.</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;