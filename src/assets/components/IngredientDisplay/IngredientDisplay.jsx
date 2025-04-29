import React from "react";
import { useState } from 'react'
import { Link } from "react-router-dom";

const IngredientDisplay = ({allIngredients, shoppingList}) => {

    //const [ingredientsQuery, setingredientsQuery] = useState('');
    const [ingredients, setIngredients] = useState(allIngredients);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    
    console.log(` shopping`, shoppingList)
    console.log(` alling`, allIngredients)

    const handleChange = (event) => {

        event.preventDefault();
        const ingredientsQuery = new RegExp(`^${event.target.value}`, 'i'); 

        const newIngredients = allIngredients.filter((ingredient) => (ingredientsQuery.test(ingredient)));

        setIngredients(newIngredients)

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

        console.log(ingredients);
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
               {!allIngredients
                    ? <></>
                    : allIngredients.map((ingredient) => (
                        <div className='ingredient-container' key={ingredient.id} onClick={handleClick(ingredient.id)}>
                            {/*<img src={ingredient.background_image} style={{ maxWidth: '600px', maxHeight: '500px' }} />*/}
                            <h2> {ingredient.name}</h2>
                        </div>
                    ))
                }
            </div>
            <button onClick={handleSubmit}>Add to shopping List: {shoppingList.name} </button>
        </div>
    )
}

export default IngredientDisplay;
