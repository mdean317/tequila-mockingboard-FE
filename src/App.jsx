
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
import ShoppingList from './assets/components/ShoppingList/ShoppingList';
import SignIn from './assets/components/auth/SignIn';
import SignUp from './assets/components/auth/SignUp';
import Home from './assets/components/Homepage/Homepage';
import IngredientList from './assets/components/Ingredient/IngredientList';

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('authToken') ? 'loggedIn' : '');
  console.log('App: Initial user state:', user);

  const [allIngredients, setAllIngredients] = useState([]);
  const [userShoppingLists, setShoppingLists] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {

    const getAllIngredients = async () => {

        // Fetch all reviews from DB
        const response = await fetch(`http://18.234.134.4:8000/api/ingredient`)

        // If successful...
        if (response) {

            // Parse JSON data into review array
            const JSONdata = await response.json()

            setAllIngredients(JSONdata || [])
        }

  const handleAuthSuccess = (userData) => {
    const authToken = userData?.key;
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      setUser('loggedIn');
      console.log('App: handleAuthSuccess - user set to:', 'loggedIn');
      navigate('/ingredients');
    } else {
      console.error('App: Authentication successful, but no token received.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser('');
    console.log('App: handleLogout - user set to:', '');
    navigate('/');
  };

  useEffect(() => {
    const getShoppingLists = async () => {
      const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist`)
      if (response) {
        const JSONdata = await response.json()
        setShoppingLists(JSONdata || [])
      }
    }
    getShoppingLists();
  }, [])

  useEffect(() => {
    const fetchShoppingLists = async () => {
      // ... your shopping list fetching logic ...
    };
    fetchShoppingLists();
  }, []);

  return (
    <div className="app-container">
      {console.log('App: User state before Navbar render:', user)}
      <Navbar user={user} />
      <Routes>
        {<Route path="/" element={<Home />} />}
        {<Route path="/ingredients" element=
              {<IngredientDisplay 
              allIngredients={allIngredients} 
              userShoppingLists={userShoppingLists} 
              />}
        />}
        <Route path="/signin" element={<SignIn onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/signup" element={<SignUp onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="/ingredients/list" element={<IngredientList ingredients={allIngredients} setIngredients={setAllIngredients}/>} />
        <Route path="/shoppinglists" element={<ShoppingList allIngredients={allIngredients} setAllIngredients={setAllIngredients} userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />} />
        <Route path="/shoppinglists/new" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists}/>} />
        <Route path="/shoppinglists/:id/edit" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists}/>} />
    </Routes>
    </div>
  );
};

const Logout = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);
  return <p>Logging out...</p>;
};

export default App;