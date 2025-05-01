import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'
//import ContactUs from './components/ContactUs';
//import Edit from './components/Edit';
//import GroceryList from './components/GroceryList';
//import Home from './components/Home';
//import HowWeStarted from './components/HowWeStarted';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
//import New from './components/New';
import IngredientList from './assets/components/Ingredient/IngredientList';
import NewIngredient from './assets/components/Ingredient/NewIngredient';
// import UpdateIngredient from './assets/components/Ingredient/UpdateIngredient';

const App = () => {

  const [user, setUser] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);
  const shoppingList = {id: 1, name: `Dean's Party`};
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
    console.log(allIngredients)
}, 
[])


  return (
    <div className="app-container">
      <Navbar user={user} />
      <Routes>
        {<Route path="/" element={<div/>} />}
        {<Route path="/ingredients" element=
              {<IngredientDisplay 
              allIngredients={allIngredients} 
              shoppingList={shoppingList} 
              />}
        />}
        <Route path="/ingredients/list" element={<IngredientList ingredients={allIngredients} setIngredients={setAllIngredients}/>} />
        <Route path="/ingredients/new" element={<NewIngredient />} />
        {/* <Route path="/ingredients/:id/edit" element={<UpdateIngredient ingredients={allIngredients} setIngredients={setAllIngredients} />} /> */}
        {/*<Route path="/shoppinglists" element={<ShoppingLists />} />*/}
        {/*<Route path="/shoppinglists/new" element={<ShoppingList />} />*/}
        {/*<Route path="/shoppinglists/:id/edit" element={<ShoppingList />} />*/}
        {/*<Route path="/how-we-started" element={<HowWeStarted />} />*/}
        {/*<Route path="/contact-us" element={<ContactUs />} />*/}
    </Routes>
    </div>
  );
};

export default App;