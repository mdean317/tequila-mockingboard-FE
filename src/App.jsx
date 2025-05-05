import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
import ShoppingList from './assets/components/ShoppingList/ShoppingList';
import SignIn from './assets/components/auth/SignIn';
import SignUp from './assets/components/auth/SignUp';
import Home from './assets/components/Homepage/Homepage';
import IngredientList from './assets/components/Ingredient/IngredientList';
import Recipes from './assets/components/Recipes/Recipes';
import Recipe from './assets/components/Recipe/Recipe';
import NewRecipe from './assets/components/NewRecipe/NewRecipe';

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

    // Fetch shopping lists
    useEffect(() => {
        const getShoppingLists = async () => {
            try {
                if (!user || !user.token) return;

                const response = await fetch('http://18.234.134.4:8000/api/shoppinglist', {
                    headers: {
                        'Authorization': `Token ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setShoppingLists(data || []);
                } else {
                    console.error('Failed to fetch shopping lists');
                }
            } catch (error) {
                console.error("Error fetching shopping lists:", error);
            }
        };

        getShoppingLists();
    }, [user]);

    // Handle login/signup success
    const handleAuthSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        navigate('/ingredients');
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const requireAuth = (component) => user ? component : <SignIn onAuthSuccess={handleAuthSuccess} />;

    return (
        <div className="app-container">
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home user={user?.user} handleLogout={handleLogout} />} />
                <Route path="/signin" element={<SignIn onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/signup" element={<SignUp onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/ingredients" element={requireAuth(<IngredientDisplay allIngredients={allIngredients} userShoppingLists={userShoppingLists} />)} />
                <Route path="/ingredients/list" element={requireAuth(<IngredientList ingredients={allIngredients} setIngredients={setAllIngredients} />)} />
                <Route path="/shoppinglists" element={requireAuth(
                    <ShoppingList allIngredients={allIngredients} setAllIngredients={setAllIngredients} userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />
                )} />
                <Route path="/shoppinglists/new" element={requireAuth(
                    <ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />
                )} />
                <Route path="/shoppinglists/:id/edit" element={requireAuth(
                    <ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />
                )} />
                <Route path="/recipes" element={requireAuth(<Recipes allIngredients={allIngredients} />)} />
                <Route path="/recipe" element={requireAuth(<Recipe allIngredients={allIngredients} />)} />
                <Route path="/recipe/new" element={requireAuth(<NewRecipe allIngredients={allIngredients} />)} />
            </Routes>
        </div>
    );
};

export default App;
