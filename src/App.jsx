import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'
//import ContactUs from './components/ContactUs';
//import Edit from './components/Edit';
import ShoppingList from './assets/components/ShoppingList/ShoppingList';
import Home from './assets/components/Homepage/Homepage';
//import HowWeStarted from './components/HowWeStarted';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
//import New from './components/New';

const App = () => {

  const [user, setUser] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);
  const [userShoppingLists, setShoppingLists] = useState([]);
  //const allIngredients = [{id : 1, name: 'Eggs'}, {id : 2, name : 'Absinthe'}];

  if (user === '666') {
    setUser('');
  }

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

    }

    getAllIngredients();

}, [])

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


  return (
    <div className="app-container">
      <Navbar user={user} />
      <Routes>
        {<Route path="/" element={<Home />} />}
        {<Route path="/ingredients" element=
              {<IngredientDisplay 
              allIngredients={allIngredients} 
              userShoppingLists={userShoppingLists} 
              />}
        />}
        {/*<Route path="/ingredients/new" element={<Ingredient />} />*/}
        {/*<Route path="/ingredients/:id/edit" element={<Ingredient />} />*/}
        <Route path="/shoppinglists" element={<ShoppingList allIngredients={allIngredients} setAllIngredients={setAllIngredients} userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists} />} />
        <Route path="/shoppinglists/new" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists}/>} />
        <Route path="/shoppinglists/:id/edit" element={<ShoppingList userShoppingLists={userShoppingLists} setShoppingLists={setShoppingLists}/>} />
        {/*<Route path="/how-we-started" element={<HowWeStarted />} />*/}
        {/*<Route path="/contact-us" element={<ContactUs />} />*/}
    </Routes>
    </div>
  );
};

export default App;