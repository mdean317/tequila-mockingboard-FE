import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'

const Navbar = ({ user }) => {
  return (
    <nav id="top-navbar">
      <Link to="/">Home</Link>
      {true ? (
        <>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <>
            <Link to="/ingredients/list">Ingredients</Link>
         <Link to="/shoppinglists">Your Shopping Lists</Link>
          <Link to="/logout">Log Out</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;