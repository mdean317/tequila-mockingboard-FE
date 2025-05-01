import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


const IngredientList = ({ingredients, setIngredients}) => {
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
        setIngredient({ ...ingredient, [name]: value });
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

    if (error) return <div>Error loading ingredients: {error} </div>;

    return (
        <div>
            <h1>Ingredients</h1>
            <ul>
                {ingredients.map((ingredient) => (
                    <><li key={ingredient.ingredient_id}>
                        <h2>{ingredient.name_of_ingredient}</h2>
                    </li>
                    <button onClick={(() => (setUpdateIngredientList(true), setUpdateIngredient(ingredient)))} >Update {ingredient.name_of_ingredient}</button></>
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
        </div>
    );
};

export default IngredientList;