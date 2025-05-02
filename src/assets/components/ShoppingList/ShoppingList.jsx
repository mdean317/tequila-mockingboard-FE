import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShoppingList = ({ userShoppingLists, setShoppingLists, allIngredients, setAllIngredients }) => {
  const [newShoppingList, setNewShoppingList] = useState({
    name: '',
    ingredients_list: [],
  });
  const [updateShoppingList, setUpdateShoppingList] = useState({
    shopping_id: null,
    name: '',
    ingredients_list: [],
  });

  const [createListView, setCreateListView] = useState(false);
  const [updateListView, setUpdateListView] = useState(false);
  const authToken = localStorage.getItem('authToken');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewShoppingList((prev) => ({ ...prev, [name]: value }));
    setUpdateShoppingList((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (!authToken) {
      console.error('Authentication required to create a shopping list.');
      return;
    }

    try {
      const response = await fetch('http://18.234.134.4:8000/api/shoppinglist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(newShoppingList),
      });

      if (response.ok) {
        const createdList = await response.json();
        setShoppingLists((prev) => [...prev, createdList]);
        setNewShoppingList({ name: '', ingredients_list: [] });
        setCreateListView(false);
      } else {
        console.error('Failed to create shopping list:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
      // Optionally display an error message to the user
    }
  };

  const handleDeleteList = async (shoppingListToDelete) => {
    if (!authToken) {
      console.error('Authentication required to delete a shopping list.');
      return;
    }

    try {
      const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/${shoppingListToDelete.shopping_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
      });

      if (response.ok) {
        const res = await fetch('http://18.234.134.4:8000/api/shoppinglist/', {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        if (res.ok) {
          const shopList = await res.json();
          setShoppingLists(shopList);
        } else {
          console.error('Failed to fetch shopping lists after deletion:', res.status);
          // Optionally display an error message
        }
      } else {
        console.error('Failed to delete shopping list:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        // Optionally display an error message
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      // Optionally display an error message
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!authToken) {
      console.error('Authentication required to update a shopping list.');
      return;
    }

    try {
      const response = await fetch(
        `http://18.234.134.4:8000/api/shoppinglist/${updateShoppingList.shopping_id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
          },
          body: JSON.stringify(updateShoppingList),
        }
      );

      if (response.ok) {
        const res = await fetch('http://18.234.134.4:8000/api/shoppinglist/', {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        if (res.ok) {
          const shopList = await res.json();
          setShoppingLists(shopList);
          setUpdateListView(false);
        } else {
          console.error('Failed to fetch shopping lists after update:', res.status);
          // Optionally display an error message
        }
      } else {
        console.error('Failed to update shopping list:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        // Optionally display an error message
      }
    } catch (error) {
      console.error('Error updating shopping list:', error);
      // Optionally display an error message
    }
  };

  return (
    <>
      {!updateListView && !createListView ? (
        <>
          <h1>Shopping List Page</h1>
          <button onClick={() => setCreateListView(true)}>Create New Shopping List</button>
          <h2>Your Shopping Lists:</h2>
          {userShoppingLists.map((shoppinglist) => (
            <div key={shoppinglist.shopping_id}>
              <h3>{shoppinglist.name}</h3>
              {shoppinglist.ingredients_list && shoppinglist.ingredients_list.length > 0 ? (
                <p>Ingredients: {shoppinglist.ingredients_list.join(', ')}</p>
              ) : (
                <p>No ingredients added yet.</p>
              )}
              <button onClick={() => {
                setCreateListView(false);
                setUpdateListView(true);
                setUpdateShoppingList(shoppinglist);
              }}>Update Shopping List
              </button>
              <button onClick={() => handleDeleteList(shoppinglist)}>Delete {shoppinglist.name}</button>
            </div>
          ))}
        </>
      ) : null}

      {createListView && (
        <>
          <h2>Create New Shopping List:</h2>
          <form onSubmit={handleCreateSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={newShoppingList.name} onChange={handleChange} required />
            <label htmlFor="ingredients_list">Ingredients:</label>
            <select
              id="ingredients_list"
              name="ingredients_list"
              multiple
              value={newShoppingList.ingredients_list}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setNewShoppingList((prev) => ({ ...prev, ingredients_list: selected }));
              }}
            >
              {allIngredients.map((ingredient) => (
                <option key={ingredient.ingredient_id} value={ingredient.name_of_ingredient}>
                  {ingredient.name_of_ingredient}
                </option>
              ))}
            </select>
            <button type="submit">Submit New List</button>
            <button onClick={() => setCreateListView(false)}>Cancel</button>
          </form>
        </>
      )}

      {updateListView && (
        <>
          <h2>Update Shopping List:</h2>
          <form onSubmit={handleUpdateSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updateShoppingList.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="ingredients_list">Ingredients:</label>
            <select
              id="ingredients_list"
              name="ingredients_list"
              multiple
              value={updateShoppingList.ingredients_list}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setUpdateShoppingList((prev) => ({ ...prev, ingredients_list: selected }));
              }}
            >
              {allIngredients.map((ingredient) => (
                <option key={ingredient.ingredient_id} value={ingredient.name_of_ingredient}>
                  {ingredient.name_of_ingredient}
                </option>
              ))}
            </select>
            <button type="submit">Update List</button>
            <button onClick={() => setUpdateListView(false)}>Cancel</button>
          </form>
        </>
      )}
      <p>
        <Link to="/">Back to Homepage</Link>
      </p>
    </>
  );
};

export default ShoppingList;