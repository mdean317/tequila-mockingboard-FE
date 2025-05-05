import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user, handleLogout }) => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tequila-Mockingbird</title>

      <div>
        <h1 className='text-8xl p-5 m-2 bg-teal-700/75 rounded-full'>Welcome to our very own Mixer App!</h1>
        <p>Pick from the very best ingredients to create your favorite drinks!</p>
        <p>Easy to navigate, no hassle — fulfill to your heart's enjoyment!</p>

        {!user ? (
          <>
            <p>Ready to shop? Let's get started!</p>
            <Link to="/signup">Sign Up</Link> | <Link to="/signin">Sign In</Link>
          </>
        ) : (
          <>
            <p>You're logged in as <strong>{user.username}</strong>!</p>
            <ul>
              <li><Link to="/ingredients">Ingredients</Link></li>
              <li><Link to="/shoppinglists">Shopping Lists</Link></li>
              <li><Link to="/recipes">Recipes</Link></li>
              <li><button onClick={handleLogout}>Log Out</button></li>
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
