import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="flex justify-around p-2" id="top-navbar"> {/* */}

      <Link className="navbar-link" to="/">Home</Link>
      {user === true ? (
        <>
          <Link className="navbar-link" to="/signin">Sign In</Link>
          <Link className="navbar-link" to="/signup">Sign Up</Link>
          
        </>
      ) : (
        <>
          <Link className="navbar-link" to="/ingredients/list">Ingredients</Link>
          <Link className="navbar-link" to="/shoppinglists">Your Shopping Lists</Link>
          <Link className="navbar-link" to="/recipes">Recipes</Link>
          <Link className="navbar-link" to="/logout">Log Out</Link>
          <Link className="navbar-link" to="/user" >Profile</Link>
        </>
      )}
    </nav>
  );
};



export default Navbar;