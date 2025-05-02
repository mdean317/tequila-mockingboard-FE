import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'

const Navbar = (user) => {

  return (
    <nav id="top-navbar">
      <div className="linkContainer">
      <Link className="navLink" to="/">Home</Link>
      </div>
      <div className="linkContainer">
      <Link className="navLink" to="/ingredients">Ingredients</Link>
      </div>
      <div className="linkContainer">
      <Link className="navLink" to="/recipes">Recipes</Link>
      </div>
      <div className="linkContainer">
      <Link className="navLink" to="/shoppinglists/new">Shopping Lists</Link>
      </div>
      {user ? 
       <div className="linkContainer">
        <Link className="navLink" to="/log-out">Log Out</Link> 
        </div>
        :
        <div className="linkContainer">
        <Link className="navLink" to="/log in">Sign Up / Log In</Link>
        </div>
      }
    </nav>
  );
};

export default Navbar;