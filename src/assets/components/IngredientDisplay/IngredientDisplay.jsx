import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IngredientDisplay = ({ userShoppingLists }) => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsToShow, setIngredientsToShow] = useState([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem('authToken'); // Get auth token

  useEffect(() => {
    const fetchIngredients = async () => {
      if (!authToken) {
        setError('Authentication required to view ingredients.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://18.234.134.4:8000/api/ingredient/', { // Fetch user-specific ingredients
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ingredients: ${response.status}`);
        }
        
// const IngredientDisplay = ({allIngredients, userShoppingLists}) => {

//     // Set state variables
//     const [ingredientsToShow, setingredientsToShow] = useState(allIngredients);
//     const [selectedIngredients, setSelectedIngredients] = useState([]);
    
//     const handleChange = (event) => {

//         const ingredientsQuery = new RegExp(`^${event.target.value}`, 'i'); 

//         const newIngredients = allIngredients.filter((ingredient) => (ingredientsQuery.test(ingredient.name_of_ingredient)));

//         setingredientsToShow(newIngredients)

        const data = await response.json();
        setIngredients(data);
        setIngredientsToShow(data); // Initialize the displayed ingredients
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [authToken]); // Dependency on authToken

  const handleSearchChange = (event) => {
    const ingredientsQuery = new RegExp(`^${event.target.value}`, 'i');
    const newIngredients = ingredients.filter((ingredient) =>
      ingredientsQuery.test(ingredient.name_of_ingredient)
    );
    setIngredientsToShow(newIngredients);
  };

  const handleIngredientClick = (id) => {
    setSelectedIngredientIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((ingId) => ingId !== id) : [...prevIds, id]
    );
  };

  const handleAddToShoppingList = async () => {
    if (!authToken) {
      setError('Authentication required to add to shopping list.');
      return;
    }
    if (selectedIngredientIds.length === 0) {
      setError('Please select ingredients to add.');
      return;
    }
    
    if (!userShoppingLists || userShoppingLists.length === 0)
    {
        setError("You don't have any shopping lists")
        return
    }

    try {
      //  Add ingredients to the first shopping list.  You might want to let the user select which shopping list.
      const shoppingListId = userShoppingLists[0].id; 
      const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/${shoppingListId}/add_ingredients/`, { // Use the correct endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify({ ingredient_ids: selectedIngredientIds }), // Send the selected ingredient IDs
      });

      if (!response.ok) {
        throw new Error(`Failed to add ingredients to shopping list: ${response.status}`);
      }

      // Optionally, show a success message to the user
      console.log('Ingredients added to shopping list successfully!');
      setSelectedIngredientIds([]); // Clear selection after successful addition
      setError(null);

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading ingredients...</div>; // Simple loading indicator
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>; // Display error message
  }

  return (
    <div>
      <h1>Ingredients</h1>
      <form className="ing-search-form">
        <input
          id="ingSearchBar"
          type="text"
          placeholder="Rum, bourbon, etc..."
          onChange={handleSearchChange}
        />
        <br />
        <br />
      </form>
      <div className="ingredientsContainer">
        {ingredientsToShow.map((ingredient) => (
          <div
            className={`ingredient-container ${selectedIngredientIds.includes(ingredient.ingredient_id) ? 'selected' : ''}`}
            key={ingredient.ingredient_id}
            onClick={() => handleIngredientClick(ingredient.ingredient_id)}
          >
            <h2>{ingredient.name_of_ingredient}</h2>
          </div>
        ))}
      </div>
      <button onClick={handleAddToShoppingList} disabled={loading}>
        Add to shopping List
      </button>
      <p>
        <Link to="/">Back to Homepage</Link>
      </p>
    </div>
  );
};

export default IngredientDisplay;
