import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


const IngredientList = ({ ingredients, setIngredients }) => {
    const [updateIngredient, setUpdateIngredient] = useState({
        ingredient_id: "",
        name_of_ingredient: "",
        type: "",
        quantity: "",
        recommended_drink: "",
        alt_ingredient: "",
        is_bought: false,
    }); 
    const [updateIngredientList, setUpdateIngredientList] = useState(false)
    const [addIngredient, setAddIngredient] = useState({
        name_of_ingredient: "",
        type: "",
        quantity: "",
        recommended_drink: "",
        alt_ingredient: "",
        is_bought: false,
    });
    const [addIngredientForm, setAddIngredientForm] = useState(false)

    // const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://18.234.134.4:8000/api/ingredient');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response);
                const data = await response.json();
                setIngredients(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchIngredients();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdateIngredient({ ...updateIngredient, [name]: value });
        setAddIngredient({ ...addIngredient, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://18.234.134.4:8000/api/ingredient/${updateIngredient.ingredient_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateIngredient),
                });

            if (response.ok) {
                alert("Ingredient updated successfully!");
            } else {
                alert("Failed to update ingredient.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://18.234.134.4:8000/api/ingredient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",    //Lets server know that data is in JSON format
                },
                body: JSON.stringify(addIngredient),   // Converts ingredient object into JSON string
            });

            if (response.ok) {
                alert("Ingredient added successfully!");
                setAddIngredient({
                    name_of_ingredient: "",
                    type: "",
                    quantity: "",
                    recommended_drink: "",
                    alt_ingredient: "",
                    is_bought: false,
                });
            } else {
                alert("Failed to add ingredient.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (ingredientId) => {
        console.log(ingredientId)
            try {
                const response = await fetch(`http://18.234.134.4:8000/api/ingredient`, {
                    method: "DELETE",
                });
    
                if (response.ok) {
                    alert("Ingredient deleted successfully!");
                    // Remove the deleted ingredient from the local state
                    setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.ingredient_id !== ingredientId));
                } else {
                    alert("Failed to delete ingredient.");
                }
            } catch (error) {
                console.error("Error deleting ingredient:", error);
            }
        
    };
    

    if (error) return <div>Error loading ingredients: {error} </div>;

    return (
        <div>
            <h1>Ingredients</h1>
            <ul>
                {ingredients.map((ingredient) => (
                    <><li key={ingredient.ingredient_id}>
                        <h2>{ingredient.name_of_ingredient}</h2>
                    </li>
                        <button onClick={(() => (setUpdateIngredientList(true), setUpdateIngredient(ingredient)))} >Update {ingredient.name_of_ingredient}</button>
                        <button onClick={() => handleDelete(ingredient.ingredient_id)}>Delete {ingredient.name_of_ingredient}</button></>
                ))}
            </ul>
            {updateIngredientList == true ?
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name_of_ingredient"
                        placeholder="Ingredient Name"
                        value={updateIngredient.name_of_ingredient}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={updateIngredient.type}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={updateIngredient.quantity}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="recommended_drink"
                        placeholder="Recommended Drink"
                        value={updateIngredient.recommended_drink}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="alt_ingredient"
                        placeholder="Alternative Ingredient ID"
                        value={updateIngredient.alt_ingredient}
                        onChange={handleChange}
                    />
                    <label>
                        Bought:
                        <input
                            type="checkbox"
                            name="is_bought"
                            checked={updateIngredient.is_bought}
                            onChange={(event) =>
                                setUpdateIngredient({ ...updateIngredient, is_bought: event.target.checked })
                            }
                        />
                    </label>
                    <button type="submit">Update Ingredient</button>
                </form>
                : <></>
            }
            <button onClick={(() => (setAddIngredientForm(true)))} >Add Ingredient</button>

{addIngredientForm == true ?
                <form onSubmit={handleAddSubmit}>
                <input
                  type="text"
                  name="name_of_ingredient"
                  placeholder="Ingredient Name"
                  value={addIngredient.name_of_ingredient}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={addIngredient.type}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={addIngredient.quantity}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="recommended_drink"
                  placeholder="Recommended Drink"
                  value={addIngredient.recommended_drink}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="alt_ingredient"
                  placeholder="Alternative Ingredient ID"
                  value={addIngredient.alt_ingredient}
                  onChange={handleChange}
                />
                <label>
                  Bought:
                  <input
                    type="checkbox"
                    name="is_bought"
                    checked={addIngredient.is_bought}
                    onChange={(event) =>
                      setAddIngredient({ ...addIngredient, is_bought: event.target.checked })
                    }
                  />
                </label>
                <button type="submit">Add Ingredient</button>
              </form>
                : <></>
            }
        </div>
    );
};

export default IngredientList;