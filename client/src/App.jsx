import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/common/SplashScreen";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ResourceDetailsPage from "./pages/ResourceDetailsPage";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onFinished={() => setShowSplash(false)} />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;