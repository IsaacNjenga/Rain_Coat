import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
      <Link
        style={{ marginRight: "10px", color: "#333", textDecoration: "none" }}
        to="/"
      >
        Home
      </Link>
      <Link style={{ color: "#333", textDecoration: "none" }} to="/favourites">
        Favourite Cities
      </Link>
    </nav>
  );
}
