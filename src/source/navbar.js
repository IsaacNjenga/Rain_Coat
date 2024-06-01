import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={leftLinksStyle}>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/favourites">Favourite Cities</Link>
      </div>
      <Link style={linkStyle} to="/login">Login</Link>
    </nav>
  );
}

const navStyle = {
  backgroundColor: "#f0f0f0",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const leftLinksStyle = {
  display: "flex",
};

const linkStyle = {
  marginRight: "10px",
  color: "#333",
  textDecoration: "none",
};
