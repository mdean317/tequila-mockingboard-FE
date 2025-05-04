import React from "react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const NewRecipe = ({allIngredients}) => {

    const [recipeData, setRecipeData] = useState({ ingredients: [], user: 1 })

    const navigate = useNavigate();

    const handleChange = (event) => {

        event.preventDefault()
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })
    };

    const handleSubmit = async (event) => {

        event.preventDefault()
        console.log(recipeData)

        const response = await fetch(`http://18.234.134.4:8000/api/recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: recipeData.name,
                instructions: recipeData.instructions,
                ingredients: recipeData.ingredients,
                user: 1
            })
        })
        
        const newRecipe = await response.json()
        console.log(newRecipe)
        setRecipeData(newRecipe)
        navToShow(event)
    }

    const navToShow = (event) => {

        event.preventDefault()
      
        navigate('/recipe', {
            state: {
                recipe: recipeData,
                activity: 'show'
            }
        }); 
    }

    return (
        <div className="recipe">
            <form onSubmit={handleSubmit}>
            <label htmlFor="name">Enter recipe name:</label>
            <input type="text" name='name'onChange={handleChange}></input>
            <label htmlFor="instructions">Instructions:</label>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70" type="text" 
                        style={{ padding: '10px', fontSize: '14px' }}
                        onChange={handleChange}>
                    </textarea>
                    <select name='ingredients' multiple 
                    onChange={(event) => {
                        const selected = Array.from(event.target.selectedOptions, option => option.value);
                        setRecipeData({...recipeData, ingredients: selected})
                        }}>
                    {allIngredients.map((ingredient) => (
                        <option key={ingredient.ingredient_id} name={ingredient.name_of_ingredient} value={ingredient.ingredient_id}>
                            {ingredient.name_of_ingredient}
                        </option>
                    ))}
                </select>
                <label htmlFor="ingredient">Ingredient: </label>
                <input type="text" name='name'onChange={handleChange}></input>
                <button className='actionBtn' onClick={navToShow}>Back </button>
                <button className='actionBtn'>Submit </button>

            </form>

        </div>
    )
}

export default NewRecipe;
