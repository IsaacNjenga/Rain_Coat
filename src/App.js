import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Favourites from "./pages/favourites";
import Navbar from "./source/navbar";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import SignUp from "./pages/signup";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
          <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
