import Navbar from "./components/Navbar";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
// import { axiosInstance } from "./lib/axios";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={ authUser ? <HomePage /> : <LoginPage />} /> */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;
