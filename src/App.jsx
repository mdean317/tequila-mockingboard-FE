import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
import ShoppingList from './assets/components/ShoppingList/ShoppingList';
import SignIn from './assets/components/auth/SignIn';
import SignUp from './assets/components/auth/SignUp';
import Home from './assets/components/Homepage/Homepage';
import IngredientList from './assets/components/Ingredient/IngredientList';
import UserProfile from './assets/components/User/UserProfile';
import Recipe from './assets/components/Recipe/Recipe'
import Recipes from './assets/components/Recipes/Recipes'
import NewRecipe from './assets/components/NewRecipe/NewRecipe'

const App = () => {
    const [user, setUser] = useState(null);
    const [allIngredients, setAllIngredients] = useState([]);
    const [userShoppingLists, setShoppingLists] = useState([]);
    const navigate = useNavigate();

    // On app load, restore session if available
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const storedUser = localStorage.getItem('user');
    //     if (token && storedUser) {
    //         setUser({ token, user: JSON.parse(storedUser) });
    //     }
    // }, []);

    // Fetch ingredients
    useEffect(() => {
        const getAllIngredients = async () => {
            try {
                const response = await fetch('http://18.234.134.4:8000/api/ingredient');
                if (response.ok) {
                    const data = await response.json();
                    setAllIngredients(data || []);
                } else {
                    console.error('Failed to fetch ingredients');
                }
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };
        getAllIngredients();
    }, []);

  // const handleAuthSuccess = (userData) => {
  //   const authToken = userData?.key;
  //   if (authToken) {
  //     localStorage.setItem('authToken', authToken);
  //     setUser('loggedIn');
  //     console.log('App: handleAuthSuccess - user set to:', 'loggedIn');
  //     navigate('/ingredients');
  //   } else {
  //     console.error('App: Authentication successful, but no token received.');
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   setUser('');
  //   console.log('App: handleLogout - user set to:', '');
  //   navigate('/');
  // };

  useEffect(() => {
    const getShoppingLists = async () => {
      const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist`);
      if (response) {
        const JSONdata = await response.json();
        setShoppingLists(JSONdata || []);
      }
    };
    getShoppingLists();
  }, []);

  return (
    <div className="app-container">
      {console.log('App: User state before Navbar render:', user)}
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients" element={
          <IngredientDisplay
            allIngredients={allIngredients}
            userShoppingLists={userShoppingLists}
          />
        } />
        {/* <Route path="/logout" element={<Logout onLogout={handleLogout} />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp  />} />
        <Route path="/ingredients/list" element={<IngredientList ingredients={allIngredients} setIngredients={setAllIngredients} />} />
        <Route path="/shoppinglists" element={<ShoppingList allIngredients={allIngredients} setAllIngredients={setAllIngredients} userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />} />
        <Route path="/shoppinglists/new" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />} />
        <Route path="/shoppinglists/:id/edit" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />} />
        {<Route path="/recipes" element={<Recipes allIngredients={allIngredients}  />}/>}
        {<Route path="/recipe" element={<Recipe allIngredients={allIngredients} />} />}
        {<Route path="/recipe/new" element={<NewRecipe allIngredients={allIngredients} />} />}
      </Routes>
    </div>
  );
};

// const Logout = ({ onLogout }) => {
//   useEffect(() => {
//     onLogout();
//   }, [onLogout]);
//   return <p>Logging out...</p>;
// };

export default App;