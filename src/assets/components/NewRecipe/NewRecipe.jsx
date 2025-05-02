import React from "react";
import { useState } from 'react'
import './NewRecipe.css'
import { useNavigate } from 'react-router-dom';

const NewRecipe = ({ allIngredients }) => {

    const [recipeData, setRecipeData] = useState({ ingredients: [] })
    const [recipeIngredients, setRecipeIngredients] = useState([])

    const navigate = useNavigate();

    const handleChange = (event) => {

        event.preventDefault()
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })
    };

    const handleSubmit = async (event) => {

        event.preventDefault()
        console.log(recipeData)

        let getNewRecipe = recipeData
        
        let ingIDArray = []
        for (const ingredient of recipeIngredients) {

            ingIDArray.push(ingredient.ingredient)

        }

        getNewRecipe.ingredients = ingIDArray;
        getNewRecipe.user = 1
        console.log(getNewRecipe)

        try {

        const response = await fetch(`http://18.234.134.4:8000/api/recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getNewRecipe)
        })

        if (!response.ok) {

            const message = await response.json(); 
            throw new Error(`DB Error: ${response.status}: ${message}`);

        } else {

            const newRecipe = await response.json()
            setRecipeData(newRecipe)
        
            for (const ingredient of recipeIngredients) {
                
                const ingDBObject = {recipe: newRecipe.recipe_id, ingredient : ingredient.ingredient, quantity: ingredient.quantity}
    
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

    const navToAllRecipes = (event) => {

        event.preventDefault()

        navigate('/recipes');
    }

    const removeIngredient = async (event, ingIndex) => {

        event.preventDefault();
        
        const updated = recipeIngredients.filter((_, index) => index !== ingIndex);
        console.log(updated)
        setRecipeIngredients(updated);
    };

    const addIngredient = (event) => {

        event.preventDefault();
        console.log(recipeIngredients)
        if (recipeIngredients.length === 0) {

            console.log('add first')
            setRecipeIngredients([{ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])

        } else {

            console.log('regular add')
            setRecipeIngredients(prev => [...prev, {ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])

        }

    }

    return (
        <div className="recipe">
            <form onSubmit={handleSubmit}>
                <h3>Ingredients:</h3>
                <div className="ingredientsContainer">
                    {recipeIngredients.map((ingredient, index) => (
                        <div key={index}>
                            <label htmlFor={`ingredient ${index}`} >Ingredient: </label>
                            <select name={`ingredient ${index}`} value={ingredient.ingredient}
                                onChange={(event) => {
                                    let tempRecipeIngredients = [...recipeIngredients];
                                    tempRecipeIngredients[index] = { ...tempRecipeIngredients[index], ingredient: parseInt(event.target.value, 10) };
                                    setRecipeIngredients(tempRecipeIngredients);
                                }}>
                                {allIngredients.map((globalIngredient, index) => (
                                    globalIngredient.ingredient_id === ingredient.ingredient
                                        ? <option key={index} value={globalIngredient.ingredient_id} > {globalIngredient.name_of_ingredient} </option>
                                        : <option key={index} value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                ))}
                            </select>
                            <label htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                            <input type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity ?? 0}
                                onChange={(event) => {
                                    const tempIngredients = [...recipeIngredients];
                                    tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                    setRecipeIngredients(tempIngredients);
                                }} ></input>
                                
                            <button className='actionBtn' onClick={(event) => removeIngredient(event, index)}>Remove </button>
                        </div>
                    ))}
                    <button className='actionBtn' onClick={addIngredient}>Add Ingredient</button>
                </div>
                <label htmlFor="name">Enter recipe name:</label>
                <input type="text" name='name' onChange={handleChange}></input>
                <label htmlFor="instructions">Instructions:</label>
                <textarea id="instructions" name="instructions"
                    rows="10" cols="70" type="text"
                    style={{ padding: '10px', fontSize: '14px' }}
                    onChange={handleChange}>
                </textarea>
                <button className='actionBtn' onClick={navToAllRecipes}>Back </button>
                <button className='actionBtn'>Submit </button>

            </form>

        </div>
    )
}

export default NewRecipe;
