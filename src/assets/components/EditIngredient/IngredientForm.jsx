import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import React from "react";


const Edit = () => {
    const { id } = useParams();
    const [allIngredients, setAllIngredients] = useState([]);
    const [ingredientsQuery, setIngredientsQuery] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all ingredients instead of a single grocery item
        fetch('http://localhost:4000/api/ingredients') // Assuming this endpoint exists
            .then(res => res.json())
            .then(data => {
                setAllIngredients(data);
                setFilteredIngredients(data); // Initially show all ingredients
            })
            .catch(err => console.error('Failed to load ingredients:', err));

        // Optionally, if you want to pre-select existing ingredients for this grocery item:
        fetch(`http://localhost:4000/api/groceries/${id}`)
            .then(res => res.json())
            .then(data => {
                // Assuming your grocery item has a field like 'ingredients' which is an array of IDs
                if (data.ingredients && Array.isArray(data.ingredients)) {
                    setSelectedIngredients(data.ingredients);
                }
            })
            .catch(err => console.error('Failed to load grocery item for pre-selection:', err));
    }, [id]);

    const handleChange = (event) => {
        const query = event.target.value;
        setIngredientsQuery(query);
        const ingredientsQueryRegex = new RegExp(`^${query}`, 'i');
        const newFilteredIngredients = allIngredients.filter((ingredient) =>
            ingredientsQueryRegex.test(ingredient.name) // Assuming your ingredient object has a 'name' property
        );
        setFilteredIngredients(newFilteredIngredients);
    };

    const handleClick = (ingredientId) => {
        const checkArray = selectedIngredients.indexOf(ingredientId);
        if (checkArray === -1) {
            setSelectedIngredients(prev => [...prev, ingredientId]);
        } else {
            setSelectedIngredients(prev => prev.filter(id => id !== ingredientId)); // Remove if already selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:4000/api/groceries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: selectedIngredients }), // Send the array of selected ingredient IDs
        });
        navigate('/groceries');
    };

    const handleDelete = async () => {
        await fetch(`http://localhost:4000/api/groceries/${id}`, {
            method: 'DELETE',
        });
        navigate('/groceries');
    };

    return (
        <div>
            <h1>Edit Grocery Item</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="ingredientSearch">
                    Search Ingredients:
                    <input
                        type="text"
                        id="ingredientSearch"
                        placeholder="Search ingredients..."
                        value={ingredientsQuery}
                        onChange={handleChange}
                    />
                </label>
                <div className='ingrdientsContainer'>
                    {filteredIngredients.map((ingredient) => (
                        <div
                            className={`ingredient-container ${selectedIngredients.includes(ingredient.id) ? 'selected' : ''}`}
                            key={ingredient.id}
                            onClick={() => handleClick(ingredient.id)}
                        >
                            <h2>{ingredient.name}</h2> {/* Assuming your ingredient object has a 'name' property */}
                            {/* You can add an image here if your ingredient object has an image URL */}
                        </div>
                    ))}
                </div>
                <button type="submit">Update Ingredients</button>
            </form>
            <button onClick={handleDelete}>Delete Grocery Item</button>
        </div>
    );
};

export default Edit;