import React from "react";
import { useState } from 'react'
import './IngredientDisplay.css'

const IngredientDisplay = ({allIngredients, shoppingList}) => {

    // Set state variables
    const [ingredientsToShow, setingredientsToShow] = useState(allIngredients);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    
    const handleChange = (event) => {

        const ingredientsQuery = new RegExp(`^${event.target.value}`, 'i'); 

        const newIngredients = allIngredients.filter((ingredient) => (ingredientsQuery.test(ingredient.name_of_ingredient)));

        setingredientsToShow(newIngredients)

    }

    const handleClick = (id) => { 

        const checkArray = selectedIngredients.indexOf(id);
        if (checkArray === -1) {

            setSelectedIngredients(prev => [...prev, id]);

        } else {

            setSelectedIngredients(selectedIngredients.splice(checkArray, 1));
        }
  
    }

    const handleSubmit = () => { // Sends user to Create Review Page

        console.log(ingredientsToShow);
        console.log(selectedIngredients);
        console.log(shoppingList);

        // TO ADD: Run fetch command that adds to DB

        // Restart the page. 
        setSelectedIngredients([])

    }

    return (
        <div>
            <h1>Ingredients</h1>
            <form className="ing-search-form">
                <input id="ingSearchBar" type='text' placeholder="Rum, burbon, etc..." onChange={handleChange} /><br /><br />
            </form>
            <div className='ingrdientsContainer'>
               {!ingredientsToShow
                    ? <></>
                    : ingredientsToShow.map((ingredient) => (
                        <div className='ingredient-container' key={ingredient.ingredient_id} onClick={() => handleClick(ingredient.ingredient_id)}>
                            {/*<img src={ingredient.background_image} style={{ maxWidth: '600px', maxHeight: '500px' }} />*/}
                            <h2> {ingredient.name_of_ingredient}</h2>
                        </div>
                    ))
                }
            </div>
            <button onClick={handleSubmit}>Add to shopping List: {shoppingList.name} </button>
        </div>
    )
}

export default IngredientDisplay;
