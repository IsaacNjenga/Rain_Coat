import React from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Favourites from "./pages/favourites";
import Navbar from "./source/navbar";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Tz from "./pages/tz";
import { AuthProvider } from "./contexts/AuthContext";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;
function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/tz" element={<Tz />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
