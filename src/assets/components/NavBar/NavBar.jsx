import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav id="top-navbar">
      <Link to="/">Home</Link>
      <Link to="/Ingredients">Ingredients</Link>
      <Link to="/shoppinglists/new">Your Shopping Lists</Link>
    </nav>
  );
};

export default Navbar;