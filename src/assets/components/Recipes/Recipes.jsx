import React from "react";
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../.././../styles.css';

const Recipes = () => {

    // Set state variables - All recipies to show. 
    const [allRecipes, setAllRecipes] = useState([]);
    
    // Grab navigation object. 
    const navigate = useNavigate();

    // Function to navigate to create a new recipe
    const navToCreate = () => {

        navigate('/recipe/new', {
        });

    }

    // Function to navigate to view/update an existing recipe
    const navToRecipe = (recipe) => {

        // Send recupe object and page activity. 
        navigate('/recipe', {
            state: {
                recipe: recipe,
                activity: 'show'
            }
        });
    }

    // TO BE IMPLEMENTED - adds recipe's ingredients to shopping list. 
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
        
        // Get all recipies from FB. 
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
    
    // Only run once on initialization. 
    }, [])

    return (
        
        // Main container. 
        <div className='flex justify-center align-middle m-10 flex-col'>

        {/* Add Recipe Button */}
        <button className='btn-primary w-40mt-4 mb-6 self-center p-2' onClick={() => navToCreate()}>Add New Recipe</button>
  
        {/* Recipes container*/}
        <div className='card-container'>

            {/* Populate recipes from DB */}   
            {allRecipes.map ((recipe) => (

                // Recipe Card
                <div key={recipe.recipe_id} className='card' >

                     <h3 className='h3-primary' > {recipe.name}</h3>
                   
                     <img src={`/${recipe.name}.jpg`} className='aspect-square w-4/5 object-cover self-center mt-2 mb-4'></img>
      
                     <button className='btn-primary self-center w-30' 
                     onClick={() => navToRecipe(recipe)}>Full Recipe</button>
                    
                     <button className='btn-primary' onClick={() => addIngredients(recipe.ingredients)}>Add Ingredients to Shopping List</button>
                </div>
                ))}
        </div>
        </div>
    )
}

export default Recipes;
