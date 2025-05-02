import React from "react";
import { useEffect, useState } from 'react'
import './Recipes.css'
import { useNavigate } from 'react-router-dom';

const Recipes = () => {

    // Set state variables
    const [allRecipes, setAllRecipes] = useState([]);
    
    const navigate = useNavigate();

    const navToCreate = () => {

        navigate('/recipe/new', {
        });

    }

    const navToRecipe = (recipe) => {

        console.log(recipe)
        console.log(recipe.recipe_id)
        navigate('/recipe', {
            state: {
                recipe: recipe,
                activity: 'show'
            }
        });
    }

    const addIngredients = async (ingredients) => {

        console.log(ingredients)
        /*
        try {
            const response = await fetch(`http://18.234.134.4:8000/api/${recipeData.recipe_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Delete failed:', error);
        }
    
        navigate('/recipes');  */
    } 

    useEffect(() => {
    
        const getAllRecipes = async () => {
    
            // Fetch all reviews from DB
            const response = await fetch(`http://18.234.134.4:8000/api/recipe`)
    
            // If successful...
            if (response) {
    
                // Parse JSON data into review array
                const JSONdata = await response.json()
    
                setAllRecipes(JSONdata || [])
            }
    
        }
    
        getAllRecipes();
    
    }, [])

    return (
        <div className='main-container'>
        <button className='addRecipeBtn' onClick={() => navToCreate()}>Add New Recipe</button>
        <div className='recipes-container'>
            {allRecipes.map ((recipe) => (
                <div className='recipe' key={recipe.recipe_id}>
                     <h3>{recipe.name}</h3>
                     <img src={`/${recipe.name}.jpg`}></img>
                     <button className='recipeBtn' onClick={() => navToRecipe(recipe)}>Read More</button>
                     <button className='addIngsBtn' onClick={() => addIngredients(recipe.ingredients)}>Add Ingredients to Shopping List</button>
                </div>
                ))}
        </div>
        </div>
    )
}

export default Recipes;
