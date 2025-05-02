import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'

const Navbar = (user) => {

  return (
    <nav id="top-navbar">
      <Link to="/">Home</Link>
      
      {/* <Link to="/ingredients" >Ingredients</Link> */}

      <Link to="/ingredients/list">Your Ingredients List</Link>
   
      <Link to="/shoppinglists">Your Shopping Lists</Link>

      {user ? 
        <Link to="/log-out">Log Out</Link> 
        :
        <Link to="/log in">Sign Up / Log In</Link>
      }
    </nav>
  );
};

export default Navbar;