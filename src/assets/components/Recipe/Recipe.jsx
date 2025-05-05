import React from "react";
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const Recipe = ({ allIngredients }) => {

    // Set state variables: page activity (changes layout), recipe info, and all updates to recipe's ingredients. 
    const [pageActivity, setPageActivity] = useState('show');
    const [recipeData, setRecipeData] = useState({ ingredients: [] })
    const [recipeIngredients, setRecipeIngredients] = useState([])

    // Get navigate and location options
    const navigate = useNavigate();
    const location = useLocation();

    // Handle change on recipe
    const handleChange = (event) => {

        event.preventDefault()
        // Update relevent field instate variable. 
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })

    };

    const handleSubmit = async (event) => { 

        event.preventDefault()

        try {

        // Update Recipe (instructions) in db. 
        await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

            // For each infredient in the updated ingredients variable
            for (const ingredient of recipeIngredients) {
                
                // Create an object for it.
                const ingDBObject = {recipe: recipeData.recipe_id, ingredient : ingredient.ingredient, quantity: ingredient.quantity}

                // Check if it has to be created (-1)
                if (ingredient.associationID == -1 ) {

                        // Create new record in DB. 
                        await fetch(`http://18.234.134.4:8000/api/recipeingredient`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ingDBObject)
                        });

                    } else {

                        // Update record in DB (probably to change quantity)
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

            // Log error. 
            console.log(error)
        }
        
        // Navigate to show the new recipe. 
        navToShow(event)
    }

    const deleteRecipe = async (event) => {
        event.preventDefault()

        try {

            // Delete the recipe. Pretty straightfroward. 
            const response = await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Delete failed:', error);
        }

        // Navigate back to recipes page 
        navToRecipes();
    }

    const navToRecipes = () => {

        // Navigate back to recipes page 
        navigate('/recipes');

    }

    const navToEdit = (event) => {

        // Reload page in edit mode. 
        event.preventDefault()

        navigate('/recipe', {
            state: {
                recipe: recipeData,
                activity: 'edit'
            }
        });

    }

    // Reload page in show mode. 
    const navToShow = (event) => {

        event.preventDefault()

        navigate('/recipe', {
            state: {
                recipe: recipeData,
                activity: 'show'
            }
        });
    }

    // This function remove an ingredient from the dynamic list of updated ingredients. 
    const removeIngredient = async (event, ingIndex) => {

        event.preventDefault();

        // Delete the ingredient IMMEDIATELY from conenction list. Not waiting for the submit here. 
        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient/${recipeIngredients[ingIndex].associationID}`, {
            method: 'DELETE'
        });

        console.log(response)
        // Remive ingredient from updated ingredient lists, using filter to keep every other ingredient. 
        const updated = recipeIngredients.filter((_, index) => index !== ingIndex);
        setRecipeIngredients(updated);
    };

    // This function adds an ingredient to the dynamic list of updated ingredients. 
    const addIngredient = (event) => {

        // Notice this ingredient has a -1 association ID, as thic recipe-ingredient doesn't exist in the db, and has to be created. 
        event.preventDefault();
        setRecipeIngredients(prev => [...prev, {associationID: -1,  ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}]);

    }
    
    // Get an array with all the relvant info on recipe's ingredients. 
    const getIngredientsForRecipe  = async (recipeID) => {

        // Get all of recipe-ingredient connections in db. 
        const response = await fetch(`http://18.234.134.4:8000/api/recipeingredient`)
        let allIngsForRecipes = await response.json()

        // Intialize array and counter of current recipe's ingredients. 
        let ingsForCurrRecipe = [{}]
        let counter = 0; 

        // Go through all recipes in db. 
        for (const association of allIngsForRecipes) {

            // If they are associated with our recipe..
            if (association.recipe === recipeID) {

                // Get selected ingredient from the all ingredients prop. 
                const ingredient = allIngredients.filter((ingredient) => ingredient.ingredient_id === association.ingredient);

                // Fill our updated ingredient array with the connection table id, ingredient id, name, quantity. 
                ingsForCurrRecipe[counter] = {associationID: association.id,  ingredient : association.ingredient, name : ingredient[0].name_of_ingredient, quantity : association.quantity}
                
                // Bump counter
                counter = counter + 1; 

            }
            
        }
        return(ingsForCurrRecipe)

    }

    useEffect(() =>  {

        const initRecipe = async () => {

            // Get recipe object from the react's router system. 
            const recipe = location.state?.recipe
            
            // Get ingredients associated with recipe from db. 
            const ingsForRecipe = await getIngredientsForRecipe(recipe.recipe_id);

            // Set page activity (are we editing ot viewing?)
            setPageActivity(location.state?.activity || 'show')

            // Set recipe state variable.
            setRecipeData(recipe)

            // Set updated recipe ingredients state variable. 
            setRecipeIngredients (ingsForRecipe)

        }

        initRecipe();

    // Run whenever page is navigated to and/or page activity is changed. 
    }, [location.state, pageActivity]);

    return (
        <div className='justify-self-center  flex justify-center align-middle flex-col w-1/2 aspect-square mx-auto' >
            <h3 className='h3-primary'>{recipeData.name}</h3>
            <img src={`/${recipeData.name}.jpg`} className='pt-2 aspect-square w-4/5 object-cover self-center mt-2 mb-4 max-w-sm ' ></img>
            {pageActivity === 'edit' ?
                <form className='flex flex-col'onSubmit={handleSubmit}>
                    <h3 className='h3-primary pt-2 pb-2'>Ingredients:</h3>
                    <div className="flex flex-wrap pb-3 justify-center">
                        {recipeIngredients.map((ingredient, index) => ( 
                            <div className='pb-1' key={index}>
                                <label className='label-primary' htmlFor={`ingredient ${index}`} >Ingredient: </label>
                                <select className='text-amber-50' name={`ingredient ${index}`} value={ingredient.ingredient}
                                onChange={(event) => {
                                        let tempRecipeIngredients = [...recipeIngredients];
                                        tempRecipeIngredients[index] = { ...tempRecipeIngredients[index], ingredient: event.target.value };
                                        setRecipeIngredients(tempRecipeIngredients);
                                        }}>
                                {allIngredients.map((globalIngredient, index) => (  
                                        globalIngredient.ingredient_id === ingredient.ingredient 
                                        ? <option className='text-amber-50' key={index}value={globalIngredient.ingredient_id} > {globalIngredient.name_of_ingredient} </option>
                                        : <option className='text-amber-50' key={index}value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                ))}
                                </select> 
                                <label className='label-primary' htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                                <input className='text-amber-50 w-12' type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity} 
                                    onChange={(event) => {
                                        const tempIngredients = [...recipeIngredients];
                                        tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                        setRecipeIngredients(tempIngredients);
                                      }} ></input>
                                <button className='btn-primary w-19 pt-0 mr-6' onClick={(event) => removeIngredient(event, index)}>Remove </button>
                            </div>
                        ))}
                    </div>
                    <button className='btn-primary w-19 self-center mb-4' onClick={addIngredient}>Add </button>
                    <label className='h3-primary' htmlFor="instructions">Instructions:</label><br></br>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70"
                        value={recipeData.instructions || ''}
                        className='text-indigo-600 border border-gray-700 rounded-md appearance-none'
                        onChange={handleChange}>
                    </textarea>
                        <div className="flex justify-around">
                            <button className='btn-primary w-1/6' onClick={navToShow}>Back </button>
                            <button className='btn-primary w-1/6'>Submit </button>
                        </div>                 
                </form>
                : <form>
                    <h3 className='h3-primary pt-2 pb-2'>Ingredients:</h3>
                    <div className="flex flex-wrap pb-3 justify-center">
                        {recipeIngredients.map((ingredient, index) => ( 
                        <div className='pb-1'key={index}>
                        <label className='label-primary' htmlFor={`ingredient ${index}`} >Ingredient: </label>
                        <input className='text-amber-50' type="text" name={`ingredient ${index}`} value={ingredient.name} onChange={handleChange} disabled/>
                        <label className='label-primary' htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                        <input className='text-amber-50' type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity} onChange={handleChange} disabled></input>
                        </div>
                        ))}
                    </div>
                    <label className='h3-primary' htmlFor="instructions">Instructions:</label><br></br>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70" 
                        value={recipeData.instructions || ''}
                        className='text-indigo-600 border border-gray-700 rounded-md appearance-none'
                        disabled>
                    </textarea>
                    <div className="flex justify-around" >
                        <button className='btn-primary w-1/6' onClick={navToEdit}>Edit </button>
                        <button className='btn-primary w-1/6' onClick={deleteRecipe}>Delete </button>
                        <button className='btn-primary w-1/6' onClick={navToRecipes}>Back </button>
                    </div>
                </form>}
        </div>
    )
}

export default Recipe;
