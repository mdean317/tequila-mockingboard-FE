import React from "react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const NewRecipe = ({ allIngredients }) => {

    // Initialize recipe and dynamic recipe's ingredient state variables. 
    const [recipeData, setRecipeData] = useState({ ingredients: [] })
    const [recipeIngredients, setRecipeIngredients] = useState([])

    // Grab navigation object. 
    const navigate = useNavigate();

    // Handle change on recipe (excluding ingredients) 
    const handleChange = (event) => {

        event.preventDefault()
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })
    };

    // Handle submit 
    const handleSubmit = async (event) => {

        event.preventDefault()

        // Get new recipe
        let getNewRecipe = recipeData
        
        // Initialize ingredient array 
        let ingIDArray = []

        for (const ingredient of recipeIngredients) {

            // For each ingredient in state variable push into array. 
            ingIDArray.push(ingredient.ingredient)

        }

        // Put infredient array in object retrieved from state variable. 
        getNewRecipe.ingredients = ingIDArray;
        getNewRecipe.user = 1

        try {

            // Add recipe to DB. 
        const response = await fetch(`http://18.234.134.4:8000/api/recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getNewRecipe)
        })

        // Check response. 
        if (!response.ok) {

            const message = await response.json(); 
            throw new Error(`DB Error: ${response.status}: ${message}`);

        } else {

            // If successful, get recipe and put in state var,
            const newRecipe = await response.json()
            setRecipeData(newRecipe)
                
            // For each ingredient in recipe
            for (const ingredient of recipeIngredients) {
                console.log(newRecipe)
                // Create recipe object
                const ingDBObject = {recipe: newRecipe.recipe_id, ingredient : ingredient.ingredient, quantity: ingredient.quantity}

                // Add recipe-ingredient conenction to d b. 
                        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ingDBObject)
                        });

                        if (!response.ok) {
                            const message = await response.json(); 
                            throw new Error(`DB Error: ${response.status}: ${message}`);
                        } 

            }
        }

        } catch (error) {

            console.log(error)
        }

        navToAllRecipes(event)
    }

    // Return to recipes page
    const navToAllRecipes = (event) => {

        event.preventDefault()

        navigate('/recipes');
    }

     // Remove ingredeint from dynamic array 
    const removeIngredient = async (event, ingIndex) => {

        event.preventDefault();
        
        const updated = recipeIngredients.filter((_, index) => index !== ingIndex);
        console.log(updated)
        setRecipeIngredients(updated);
    };

    // Add ingredeint to dynamic array 
    const addIngredient = (event) => {

        event.preventDefault();
        console.log(recipeIngredients)

        // Check if array is empty. 
        if (recipeIngredients.length === 0) {

            // If it is, update it directly with first element. 
            setRecipeIngredients([{ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])

        } else {

            // Otherwise, use prev. 
            setRecipeIngredients(prev => [...prev, {ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])

        }

    }

    return (
        <div className='justify-self-center flex justify-center align-middle flex-col w-1/2 aspect-square mx-auto' >
            <form onSubmit={handleSubmit}>
                <label className='h3-primary' htmlFor="name">Recipe name:</label>
                <input className='text-xl text-indigo-600 border border-gray-700 rounded-md appearance-none pl-2'
                    type="text" name='name' onChange={handleChange}></input>
                <h3 className='h3-primary pt-2 pb-2'>Ingredients:</h3>
                <div className="flex flex-wrap pb-3 justify-center">
                    {recipeIngredients.map((ingredient, index) => (
                        <div className='pb-1 self-center' key={index}>
                            <label className='label-primary' htmlFor={`ingredient ${index}`} >Ingredient: </label>
                            <select className='text-amber-50' name={`ingredient ${index}`} value={ingredient.ingredient}
                                onChange={(event) => {
                                    let tempRecipeIngredients = [...recipeIngredients];
                                    tempRecipeIngredients[index] = { ...tempRecipeIngredients[index], ingredient: parseInt(event.target.value, 10) };
                                    setRecipeIngredients(tempRecipeIngredients);
                                }}>
                                {allIngredients.map((globalIngredient, index) => (
                                    globalIngredient.ingredient_id === ingredient.ingredient
                                        ? <option className='text-amber-50' key={index} value={globalIngredient.ingredient_id} > {globalIngredient.name_of_ingredient} </option>
                                        : <option className='text-amber-50' key={index} value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                ))}
                            </select>
                            <label className='label-primary'htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                            <input className='text-amber-50 w-12' type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity ?? 0}
                                onChange={(event) => {
                                    const tempIngredients = [...recipeIngredients];
                                    tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                    setRecipeIngredients(tempIngredients);
                                }} ></input>
                                
                            <button className='btn-primary w-19 pt-0 mr-6' onClick={(event) => removeIngredient(event, index)}>Remove </button>
                        </div>
                    ))}
                </div>
                <button className='btn-primary w-19 mb-4' onClick={addIngredient}>Add</button>
                <br></br>
                <label className='h3-primary' htmlFor="instructions">Instructions:</label>
                <textarea id="instructions" name="instructions"
                    rows="10" cols="70" type="text"
                    className='text-indigo-600 border border-gray-700 rounded-md appearance-none'
                    onChange={handleChange}>
                </textarea>
                <div className="flex justify-around">
                <button className='btn-primary w-1/6' onClick={navToAllRecipes}>Back </button>
                <button className='btn-primary w-1/6'>Submit </button>
                </div>

            </form>
        </div>
    )
}
export default NewRecipe;
