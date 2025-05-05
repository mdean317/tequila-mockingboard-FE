import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="flex justify-around p-4" id="top-navbar"> {/* */}

      <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/">Home</Link>
      {user === true ? (
        <>
          <Link className="text-black font-bold p-2 bg-white rounded-xl" to="/signin">Sign In</Link>
          <Link className="text-black font-bold p-2 bg-white rounded-xl" to="/signup">Sign Up</Link>
          
        </>
      ) : (
        <>
          <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/ingredients/list">Ingredients</Link>
          <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/shoppinglists">Your Shopping Lists</Link>
          <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/recipes">Recipes</Link>
          <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/logout">Log Out</Link>
          {/* <Link className="text-black font-bold p-2 bg-yellow-50 rounded-xl" to="/user" >Profile</Link> */}
        </>
      )}
    </nav>
  );
};

export default Navbar;