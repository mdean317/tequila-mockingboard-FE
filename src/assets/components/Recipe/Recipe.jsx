import React from "react";
import { useEffect, useState } from 'react'
import './Recipe.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Recipe = ({allIngredients}) => {

    const [pageActivity, setPageActivity] = useState('show');
    const [recipeData, setRecipeData] = useState({ ingredients: [] })

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event) => {
        event.preventDefault()
        
        setRecipeData({ ...recipeData, [event.target.name]: event.target.value })
    };

    const handleSubmit = async (event) => {

        event.preventDefault()
        const formData = new FormData(event.target);
        const selectedIngredients = formData.getAll('ingredients').map(Number);
        console.log(selectedIngredients)
        const recipeToSend = recipeData
        recipeToSend.ingredients = selectedIngredients
        const response1 = await fetch(`http://18.234.134.4:8000/api/recipeingredient`)

        let allIngsAndRecipes = await response1.json()
        
        //const recipesDBIngredients = allIngsAndRecipes.filter((conenction) => conenction.recipe === recipeData.recipe_id);

        console.log(allIngsAndRecipes)
       
        //let counter = 0; 
        /*
        // For every receipe/ingredient conenction in the DB
        for (const ingredient of recipesDBIngredients) {

            const indexOfIngredientInNewRecipe = recipeToSend.indexOf(ingredient.ingredient)
            if (indexOfIngredientInNewRecipe === -1) {

                console.log('To Delete:')
                console.log(ingredient.ingredient)
                console.log(recipeData.recipe_id)
                const response = await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
                    method: 'DELETE'
                });

                console.log(response)

            }
                // And for every ingredient in the recipe we're working on... 
                for (const recipeIngredient of recipeData.ingredients) {

                    console.log(recipeIngredient)
                    // Make sure 
                    if ((recipeIngredient.recipe === recipeData.recipe_id) && ((recipeData.ingredients.indexOf("bison")))) {
                        console.log(recipeIngredient)
                    }

                if (originalIngrdient === selectedIngredients[counter]) {

                    const response = await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
                        method: 'DELETE'
                    });

                    console.log(response)

                }

                const response = await fetch(`http://18.234.134.4:8000/api/ingredient/${ingredient}`)

                const ingredientData = await response.json()

                for (const association of allIngsAndRecipes) {

                    if ((association.recipe === recipe.recipe_id) && (association.ingredient === ingredient)) {}

                        ingredientArray[counter] = { id: ingredientData.ingredient_id, name: ingredientData.name_of_ingredient, quantity : association.quantity}
                        counter = counter + 1;
                }

                }
        
            }

            const response = await fetch(`http://18.234.134.4:8000/api/recipe/${recipeData.recipe_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipeToSend)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('Success:', result);

    */
        setPageActivity('show')
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

    useEffect(() => {

        const initRecipe = async () => {

            const recipe = location.state?.recipe
            setPageActivity(location.state?.activity || 'show')  
            setRecipeData(recipe)

        }

        initRecipe();

    }, [location.state, pageActivity]);

    return (
        <div className="recipe">
            <h3>{recipeData.name}</h3>
            <img src={`/${recipeData.name}.jpg`}></img>
            {pageActivity === 'edit' ?
                <form onSubmit={handleSubmit}>
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea id="instructions" name="instructions"
                        rows="10" cols="70" type="text" 
                        value={recipeData.instructions}
                        style={{ padding: '10px', fontSize: '14px' }}
                        onChange={handleChange}>
                    </textarea>
                    <select name='ingredients' multiple value={recipeData.ingredients}
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
                    <div className="buttonContainer">
                        <button className='actionBtn' onClick={navToShow}>Back </button>
                        <button className='actionBtn'>Submit </button>
                    </div>
                </form>
                : <form>
                    <label htmlFor="Ingredients">Ingredients:</label>
                    <div className="ingredientsContainer">
                    <select name='ingredients' multiple value={recipeData.ingredients}> 
                    {allIngredients.map((ingredient) => (
                        <option key={ingredient.ingredient_id} name={ingredient.name_of_ingredient} value={ingredient.ingredient_id}>
                            {ingredient.name_of_ingredient}
                        </option>
                    ))}
                </select>
                </div>
                    <label htmlFor="Instructions">Instructions:</label>
                    <textarea id="Instructions" name="Instructions"
                        rows="10" cols="70" type="text"
                        value={recipeData.instructions}
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
