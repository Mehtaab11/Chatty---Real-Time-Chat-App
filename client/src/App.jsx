import Navbar from "./components/Navbar";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
// import { axiosInstance } from "./lib/axios";

function App() {
  const { authUser } = useAuthStore();
  return (
    <>
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
