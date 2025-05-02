import React from "react";
import { useEffect, useState } from 'react'
import './Recipe.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Recipe = ({ allIngredients }) => {

    const [pageActivity, setPageActivity] = useState('show');
    const [recipeData, setRecipeData] = useState({ ingredients: [] })
    const [recipeIngredients, setRecipeIngredients] = useState([])

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event) => {

        event.preventDefault()

        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })

    };

    const handleSubmit = async (event) => {

        event.preventDefault()
        console.log('recipeData')
        console.log(recipeData)
        console.log('recipeIngredients')
        console.log(recipeIngredients)

        // Update Recipe (instructions)
        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient`)
        const allIngsAndRecipes = await response.json()
        console.log(allIngsAndRecipes)

        await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

        // recipeData: {recipe_id, ingredients(3) [2, 3, 4]
        // recipeIngredients:  {associationID: 3, ingredient: 3, name: 'Orange Juice', quantity: 2}
        // Check if there are ingredients to be deleted 
        // For each ingredient in the form...   
        try {
            for (const ingredient of recipeIngredients) {
                
                const ingDBObject = {recipe: recipeData.recipe_id, ingredient : ingredient.ingredient, quantity: ingredient.quantity}
                // Check if it has to be created (-1)
                if (ingredient.associationID == -1 ) {

                        await fetch(`http://18.234.134.4:8000/api/recipeingredient`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ingDBObject)
                        });

                    } else {

                        await fetch(`http://18.234.134.4:8000/api/recipeingredient/${ingredient.associationID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ingDBObject)
                        });
                    }
            }
        } catch (error) {

            console.log(error)
        }
       
        navToShow(event)
    }

    const deleteRecipe = async (event) => {
        event.preventDefault()

        try {

            const response = await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Delete failed:', error);
        }

        navigate('/recipes');
    }

    const navToRecipes = () => {

        navigate('/recipes');

    }

    const navToEdit = (event) => {

        event.preventDefault()

        navigate('/recipe', {
            state: {
                recipe: recipeData,
                activity: 'edit'
            }
        });

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

    const removeIngredient = async (event, ingIndex) => {

        event.preventDefault();

        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient/${recipeIngredients[ingIndex].associationID}`, {
            method: 'DELETE'
        });
            
        console.log(response)

        const updated = recipeIngredients.filter((_, index) => index !== ingIndex);
        setRecipeIngredients(updated);
    };

    const addIngredient = (event) => {

        event.preventDefault();
        setRecipeIngredients(prev => [...prev, {associationID: -1,  ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}]);

    }
    
    const getIngredientsForRecipe  = async (recipeID) => {

        console.log(recipeID)
        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient`)
        let allIngsForRecipes = await response.json()
        let ingsForCurrRecipe = [{}]
        let counter = 0; 
        for (const association of allIngsForRecipes) {

            if (association.recipe === recipeID) {

                const ingredient = allIngredients.filter((ingredient) => ingredient.ingredient_id === association.ingredient);
                ingsForCurrRecipe[counter] = {associationID: association.id,  ingredient : association.ingredient, name : ingredient[0].name_of_ingredient, quantity : association.quantity}
                counter = counter + 1; 

            }
            
        }
        return(ingsForCurrRecipe)

    }

    useEffect(() =>  {

        const initRecipe = async () => {

            const recipe = location.state?.recipe
            console.log(recipe)
            const ingsForRecipe = await getIngredientsForRecipe(recipe.recipe_id);
            setPageActivity(location.state?.activity || 'show')
            setRecipeData(recipe)
            console.log(ingsForRecipe)
            setRecipeIngredients (ingsForRecipe)

        }

        initRecipe();

    }, [location.state, pageActivity]);

    return (
        <div className="recipe">
            <h3>{recipeData.name}</h3>
            <img src={`/${recipeData.name}.jpg`}></img>
            {pageActivity === 'edit' ?
                <form onSubmit={handleSubmit}>
                    <h3>Ingredients:</h3>
                    <div className="ingredientsContainer">
                        {recipeIngredients.map((ingredient, index) => ( 
                            <div key={index}>
                                <label htmlFor={`ingredient ${index}`} >Ingredient: </label>
                                <select name={`ingredient ${index}`} value={ingredient.ingredient}
                                onChange={(event) => {
                                        let tempRecipeIngredients = [...recipeIngredients];
                                        tempRecipeIngredients[index] = { ...tempRecipeIngredients[index], ingredient: event.target.value };
                                        setRecipeIngredients(tempRecipeIngredients);
                                        }}>
                                {allIngredients.map((globalIngredient, index) => (  
                                        globalIngredient.ingredient_id === ingredient.ingredient 
                                        ? <option key={index}value={globalIngredient.ingredient_id} > {globalIngredient.name_of_ingredient} </option>
                                        : <option key={index}value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                ))}
                                </select> 
                                <label htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                                <input type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity} 
                                    onChange={(event) => {
                                        const tempIngredients = [...recipeIngredients];
                                        tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                        setRecipeIngredients(tempIngredients);
                                      }} ></input>
                                <button className='actionBtn' onClick={(event) => removeIngredient(event, index)}>Remove </button>
                            </div>
                        ))}
                        <button className='actionBtn' onClick={addIngredient}>Add </button>
                    </div>
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70"
                        value={recipeData.instructions || ''}
                        style={{ padding: '10px', fontSize: '14px' }}
                        onChange={handleChange}>
                    </textarea>
                        <div className="buttonContainer">
                            <button className='actionBtn' onClick={navToShow}>Back </button>
                            <button className='actionBtn'>Submit </button>
                        </div>                 
                </form>
                : <form>
                    <h3>Ingredients:</h3>
                    <div className="ingredientsContainer">
                        {recipeIngredients.map((ingredient, index) => ( 
                        <div key={index}>
                        <label htmlFor={`ingredient ${index}`} >Ingredient: </label>
                        <input type="text" name={`ingredient ${index}`} value={ingredient.name} onChange={handleChange} disabled/>
                        <label htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                        <input type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity} onChange={handleChange} disabled></input>
                        </div>
                        ))}
                    </div>
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70" 
                        value={recipeData.instructions || ''}
                        style={{ padding: '10px', fontSize: '14px' }}
                        disabled>
                    </textarea>
                    <div className="buttonContainer">
                        <button className='actionBtn' onClick={navToEdit}>Edit </button>
                        <button className='actionBtn' onClick={deleteRecipe}>Delete </button>
                        <button className='actionBtn' onClick={navToRecipes}>Back </button>
                    </div>
                </form>}
        </div>
    )
}

export default Recipe;
