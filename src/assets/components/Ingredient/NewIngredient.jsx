import React from "react";
import { useState } from 'react'

const NewIngredient = () => {
    const [ingredient, setIngredient] = useState({
      name_of_ingredient: "",
      type: "",
      quantity: "",
      recommended_drink: "",
      alt_ingredient: "",
      is_bought: false,
    });
  
    // const handleChange = (event) => {
    //   const { name, value } = event.target;
    //   setIngredient({ ...ingredient, [name]: value });
    // };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch("http://18.234.134.4:8000/api/ingredient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",    //Lets server know that data is in JSON format
          },
          body: JSON.stringify(ingredient),   // Converts ingredient object into JSON string
        });
  
        if (response.ok) {
          alert("Ingredient added successfully!");
          setIngredient({
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
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name_of_ingredient"
          placeholder="Ingredient Name"
          value={ingredient.name_of_ingredient}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={ingredient.type}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={ingredient.quantity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="recommended_drink"
          placeholder="Recommended Drink"
          value={ingredient.recommended_drink}
          onChange={handleChange}
        />
        <input
          type="number"
          name="alt_ingredient"
          placeholder="Alternative Ingredient ID"
          value={ingredient.alt_ingredient}
          onChange={handleChange}
        />
        <label>
          Bought:
          <input
            type="checkbox"
            name="is_bought"
            checked={ingredient.is_bought}
            onChange={(event) =>
              setIngredient({ ...ingredient, is_bought: event.target.checked })
            }
          />
        </label>
        <button type="submit">Add Ingredient</button>
      </form>
    );
  };
  
  export default NewIngredient;