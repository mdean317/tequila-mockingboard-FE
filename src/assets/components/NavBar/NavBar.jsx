import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'

const Navbar = ({ user }) => {
  return (
    <nav id="top-navbar">
<div className="linkContainer">
      <Link className="navLink" to="/">Home</Link>
      
      </div>
      {user === true ? (
        <>
        <div className="linkContainer">
          <Link to="/signin">Sign In</Link>
          </div>
          <div className="linkContainer">
          <Link to="/signup">Sign Up</Link>
          <Link to="/user" >Profile</Link>
          </div>
        </>
      ) : (
        <>
        <div className="linkContainer">
            <Link to="/ingredients/list">Ingredients</Link>
            </div>
            <div className="linkContainer">
         <Link to="/shoppinglists">Your Shopping Lists</Link>
         </div>
         <div className="linkContainer">
      <Link className="navLink" to="/recipes">Recipes</Link>
      </div>
         <div className="linkContainer">
          <Link to="/logout">Log Out</Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;