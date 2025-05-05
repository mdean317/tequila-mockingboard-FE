import React, { useState, useEffect } from 'react';

const ShoppingList = ({ userShoppingLists, setShoppingLists, allIngredients }) => {
    const [newShoppingList, setNewShoppingList] = useState({
        name: '',
        ingredients: [], // Changed to 'ingredients' to match backend
    });
    const [updateShoppingList, setUpdateShoppingList] = useState({
        shopping_id: null,
        name: '',
        ingredients: [],  // Changed to 'ingredients'
    });
    const [createListView, setCreateListView] = useState(false);
    const [updateListView, setUpdateListView] = useState(false);
    const [selectedList, setSelectedList] = useState(null); // Track the selected list for updating

    const handleChange = (event) => {
        if (createListView) {
            setNewShoppingList({ ...newShoppingList, [event.target.name]: event.target.value });
        } else if (updateListView) {
            setUpdateShoppingList({ ...updateShoppingList, [event.target.name]: event.target.value });
        }

    };

    const handleIngredientChange = (ingredientId, quantity, isCreating) => {
        const ingredientData = { ingredient_id: ingredientId, quantity: quantity };
        if (isCreating) {
            const existingIndex = newShoppingList.ingredients.findIndex(item => item.ingredient_id === ingredientId);
            if (existingIndex > -1) {
                const updatedIngredients = [...newShoppingList.ingredients];
                updatedIngredients[existingIndex] = ingredientData;
                setNewShoppingList({ ...newShoppingList, ingredients: updatedIngredients });
            } else {
                setNewShoppingList({ ...newShoppingList, ingredients: [...newShoppingList.ingredients, ingredientData] });
            }
        } else {
            const existingIndex = updateShoppingList.ingredients.findIndex(item => item.ingredient_id === ingredientId);
            if (existingIndex > -1) {
                const updatedIngredients = [...updateShoppingList.ingredients];
                updatedIngredients[existingIndex] = ingredientData;
                setUpdateShoppingList({ ...updateShoppingList, ingredients: updatedIngredients });
            } else {
                setUpdateShoppingList({ ...updateShoppingList, ingredients: [...updateShoppingList.ingredients, ingredientData] });
            }
        }

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/`, { // Corrected URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newShoppingList), // Send the newShoppingList state
        });
        const createdList = await response.json();
        setShoppingLists(prev => [...prev, createdList]); // Update the list in App component
        setNewShoppingList({ name: '', ingredients: [] });
        setCreateListView(false);
    };

    const handleDeleteList = async (shoppingList) => { // Receive shopping list object
        await fetch(`http://18.234.134.4:8000/api/shoppinglist/${shoppingList.shopping_id}/`, { // Use shoppingList.shopping_id
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setShoppingLists(prevLists => prevLists.filter(list => list.shopping_id !== shoppingList.shopping_id)); // Update in App
    };

    const handleUpdateShoppingList = async (event) => {
        event.preventDefault();
        const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/${updateShoppingList.shopping_id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateShoppingList), // Send the updateShoppingList
        });

        if (response.ok) {
            const updatedList = await response.json();
            setShoppingLists(prevLists =>
                prevLists.map(list =>
                    list.shopping_id === updatedList.shopping_id ? updatedList : list
                )
            ); // Update the specific list
            setUpdateListView(false);
            setSelectedList(null);
            setUpdateShoppingList({ shopping_id: null, name: '', ingredients: [] }); // Reset update form
        }
    };

    const startUpdate = (shoppingList) => {
        setSelectedList(shoppingList);
        setUpdateShoppingList({
            shopping_id: shoppingList.shopping_id,
            name: shoppingList.name,
            ingredients: shoppingList.ingredients.map(item => ({
                ingredient_id: item.ingredient.ingredient_id, // Access ingredient ID correctly
                quantity: item.quantity
            }))
        });
        setCreateListView(false);
        setUpdateListView(true);
    }

    useEffect(() => {
        if (updateListView && selectedList) {
            setUpdateShoppingList({
                shopping_id: selectedList.shopping_id,
                name: selectedList.name,
                ingredients: selectedList.ingredients.map(item => ({
                    ingredient_id: item.ingredient.ingredient_id,
                    quantity: item.quantity
                }))
            })
        }
    }, [updateListView, selectedList])

    return (
        <>
            {updateListView === false && createListView === false ? (
                <>
                    <h1 className="text-decoration: underline text-gray-600 opacity: 0.25">Shopping List Page</h1>

                    <button onClick={() => { setCreateListView(true); setUpdateListView(false) }}>Create New Shopping List</button>

                    <h2>Your Shopping Lists:</h2>
                    {userShoppingLists.map((shoppinglist) => (
                        <div key={shoppinglist.shopping_id}>
                            <h3>{shoppinglist.name}</h3>
                            <ul>
                                {shoppinglist.ingredients.map(item => (
                                    <li key={item.ingredient.ingredient_id}>
                                        {item.ingredient.name_of_ingredient} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => startUpdate(shoppinglist)}>Update Shopping List</button>
                            <button onClick={() => handleDeleteList(shoppinglist)}>Delete {shoppinglist.name}</button>
                        </div>
                    ))}
                </>
            ) : <></>}

            {createListView === true ? (
                <>
                    <h2>Create New Shopping List:</h2>
                    <form onSubmit={handleSubmit}>
                        <label name="name">Name: </label>
                        <input name="name" value={newShoppingList.name} onChange={handleChange} required />
                        <div>
                            <h3>Select Ingredients:</h3>
                            {allIngredients.map((ingredient) => (
                                <div key={ingredient.ingredient_id}>
                                    <label htmlFor={`create-ingredient-${ingredient.ingredient_id}`}>
                                        {ingredient.name_of_ingredient}
                                    </label>
                                    <input
                                        type="number"
                                        id={`create-ingredient-${ingredient.ingredient_id}`}
                                        min="1"
                                        defaultValue="1"
                                        onChange={(e) =>
                                            handleIngredientChange(
                                                ingredient.ingredient_id,
                                                parseInt(e.target.value, 10),
                                                true
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="submit">Submit New List</button>
                    </form>
                </>
            ) : <></>}

            {updateListView === true ? (
                <>
                    <h2>Update Shopping List:</h2>
                    <form onSubmit={handleUpdateShoppingList}>
                        <label name="name">Name: </label>
                        <input name="name" value={updateShoppingList.name} onChange={handleChange} required />
                        <div>
                            <h3>Select Ingredients and Quantities:</h3>
                            {allIngredients.map((ingredient) => {
                                const ingredientInList = updateShoppingList.ingredients.find(
                                    (item) => item.ingredient_id === ingredient.ingredient_id
                                );
                                const quantity = ingredientInList ? ingredientInList.quantity : 1;
                                return (
                                    <div key={ingredient.ingredient_id}>
                                        <label htmlFor={`update-ingredient-${ingredient.ingredient_id}`}>
                                            {ingredient.name_of_ingredient}
                                        </label>
                                        <input
                                            type="number"
                                            id={`update-ingredient-${ingredient.ingredient_id}`}
                                            min="1"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    ingredient.ingredient_id,
                                                    parseInt(e.target.value, 10),
                                                    false
                                                )
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <button type="submit">Update List</button>
                    </form>
                </>
            ) : <></>}
        </>
    );
};

export default ShoppingList;
