import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="flex justify-around p-4" id="top-navbar">

            <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/">Home</Link>
            {user ? ( // If 'user' has a truthy value (e.g., the user object after login)
                <>
                    <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/ingredients/list">Ingredients</Link>
                    <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/shoppinglists">Your Shopping Lists</Link>
                    <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/recipes">Recipes</Link>
                    <button className="text-blue-700 font-bold p-2 bg-red-700 rounded-xl" onClick={onLogout}>Log Out</button>
                </>
            ) : ( // If 'user' is null or false (initial state or after logout)
                <>
                    <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/signin">Sign In</Link>
                    <Link className="text-blue-700 font-bold p-2 bg-green-700 rounded-xl" to="/signup">Sign Up</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;