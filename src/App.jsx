import { Routes, Route } from 'react-router-dom';
//import ContactUs from './components/ContactUs';
//import Edit from './components/Edit';
//import GroceryList from './components/GroceryList';
//import Home from './components/Home';
//import HowWeStarted from './components/HowWeStarted';
import Navbar from './assets/components/NavBar/NavBar';
import IngredientDisplay from './assets/components/IngredientDisplay/IngredientDisplay';
//import New from './components/New';

const App = () => {

  const shoppingList = {id: 1, name: `Dean's Party`};
  const allIngredients = [{id : 1, name: 'Eggs'}, {id : 2, name : 'Absinthe'}];

  return (
    <div className="app-container">
      <Navbar />
      <h1>Welcome </h1>
      <Routes>
        {<Route path="/" element={<div/>} />}
        {<Route path="/ingredients" element=
              {<IngredientDisplay 
              allIngredients={allIngredients} 
              shoppingList={shoppingList} 
              />}
        />}
        {/*<Route path="/ingredients/new" element={<Ingredient />} />*/}
        {/*<Route path="/ingredients/:id/edit" element={<Ingredient />} />*/}
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