import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './IngredientList.css'


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
                setUpdateIngredientList(false);  // hides update form after submit
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
                setAddIngredientForm(false);  //  Hides add ingredient form after submit
                setAddIngredient({
                    name_of_ingredient: "",
                    type: "",
                    quantity: "",
                    recommended_drink: "",
                    alt_ingredient: "",
                    is_bought: false,
                });
                //  Add the new ingredient to the ingredient list 
                const updatedResponse = await fetch('http://18.234.134.4:8000/api/ingredient');
                const updatedData = await updatedResponse.json();
                setIngredients(updatedData);
            } else {
                alert("Failed to add ingredient.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (ingredientId) => {
        try {
            const response = await fetch(`http://18.234.134.4:8000/api/ingredient/${ingredientId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Ingredient deleted successfully!");
                // Remove the deleted ingredient from the ingredient list
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
            <h1 className="font-bold text-5xl m-8" >INGREDIENT LIST</h1>
            <ul className="container py-8 w-5/12 h-5/6 mx-auto bg-yellow-50 items-center border-solid border-black rounded border-2">
                {ingredients.map((ingredient) => (
                    <><li key={ingredient.ingredient_id}>
                        <h2 className="text-lg font-semibold">{ingredient.name_of_ingredient}</h2>
                    </li>
                        <button className="hover:bg-green-700 cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4" 
                        onClick={() => setUpdateIngredientList(!updateIngredientList) (setUpdateIngredient(ingredient))} >Update {ingredient.name_of_ingredient}</button>
                        
                        <button className="hover:bg-red-700 cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4" 
                        onClick={() => handleDelete(ingredient.ingredient_id)}>Delete {ingredient.name_of_ingredient}</button></>
                ))}
            </ul>
            {updateIngredientList == true ?
                <form onSubmit={handleSubmit}>
                    <input className="bg-white m-4 border-solid border-black rounded border-1 p-0.5"
                        type="text"
                        name="name_of_ingredient"
                        placeholder="Ingredient Name"
                        value={updateIngredient.name_of_ingredient}
                        onChange={handleChange}
                        required
                    />
                    <input className="bg-white m-4 border-solid border-black rounded border-1 p-0.5"
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={updateIngredient.type}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4 border-solid border-black rounded border-1 p-0.5"
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={updateIngredient.quantity}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4 border-solid border-black rounded border-1 p-0.5"
                        type="text"
                        name="recommended_drink"
                        placeholder="Recommended Drink"
                        value={updateIngredient.recommended_drink}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4 border-solid border-black rounded border-1 p-0.5"
                        type="number"
                        name="alt_ingredient"
                        placeholder="Alternative Ingredient ID"
                        value={updateIngredient.alt_ingredient}
                        onChange={handleChange}
                    />
                    <label>
                        Bought:
                        <input className="bg-white m-4"
                            type="checkbox"
                            name="is_bought"
                            checked={updateIngredient.is_bought}
                            onChange={(event) =>
                                setUpdateIngredient({ ...updateIngredient, is_bought: event.target.checked })
                            }
                        />
                    </label>
                    <button  className="cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4"
                    type="submit">Update Ingredient</button>
                </form>
                : <></>
            }
            <button className="hover:bg-green-700 cursor-pointer text-black font-bold p-2 bg-yellow-50 rounded-xl border-2 px-1 m-4"
            onClick={() => setAddIngredientForm(!addIngredientForm)} >Add Ingredient</button>

            {addIngredientForm == true ?
                <form onSubmit={handleAddSubmit}>
                    <input className="bg-white m-4 border-solid border-black rounded border-1"
                        type="text"
                        name="name_of_ingredient"
                        placeholder="Ingredient Name"
                        value={addIngredient.name_of_ingredient}
                        onChange={handleChange}
                        required
                    />
                    <input className="bg-white m-4  border-solid border-black rounded border-1 p-0.5"
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={addIngredient.type}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4  border-solid border-black rounded border-1 p-0.5"
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={addIngredient.quantity}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4  border-solid border-black rounded border-1 p-0.5"
                        type="text"
                        name="recommended_drink"
                        placeholder="Recommended Drink"
                        value={addIngredient.recommended_drink}
                        onChange={handleChange}
                    />
                    <input className="bg-white m-4  border-solid border-black rounded border-1 p-0.5"
                        type="number"
                        name="alt_ingredient"
                        placeholder="Alternative Ingredient ID"
                        value={addIngredient.alt_ingredient}
                        onChange={handleChange}
                    />
                    <label>
                        Bought:
                        <input className="bg-white m-4"
                            type="checkbox"
                            name="is_bought"
                            checked={addIngredient.is_bought}
                            onChange={(event) =>
                                setAddIngredient({ ...addIngredient, is_bought: event.target.checked })
                            }
                        />
                    </label>
                    <button className="hover:bg-green-700 cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4"
                    type="submit">Add Ingredient</button>
                </form>
                : <></>
            }
        </div>
    );
};

export default IngredientList;