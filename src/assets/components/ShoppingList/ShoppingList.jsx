import { useState, useEffect } from 'react'

const ShoppingList = ({userShoppingLists, setShoppingLists, allIngredients}) => {

    const [createListView, setCreateListView] = useState(false)
    const [updateListView, setUpdateListView] = useState(false)

    const [shoppingListIngredients, setShoppingListIngredients] = useState([])

    const [newShoppingList, setNewShoppingList] = useState({ ingredients_list: [] })
    const [newListIngredients, setNewListIngredients] = useState([])

    const [updateListIngredients, setUpdateListIngredients] = useState([])
    const [updateShoppingList, setUpdateShoppingList] = useState({
        shopping_id: null,
        name: '',
        ingredients_list: [],
    })

    useEffect(() => {
        const getAllShoppingListIngredients = async () => {
            const res = await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`)
            const JSONdata = await res.json()
            setShoppingListIngredients(JSONdata || []);
        }
        getAllShoppingListIngredients()
    }, []);

    const handleChange = (event) => {
        if (createListView) {
            setNewShoppingList({ ...newShoppingList, [event.target.name]: event.target.value });
        } else if (updateListView) {
            setUpdateShoppingList({ ...updateShoppingList, [event.target.name]: event.target.value });
        }

    };

    const handleIngredientChange = (ingredientId, quantity, isCreating) => {
        const ingredientData = { ingredient_id: ingredientId, quantity: quantity };
        if (isCreating) {
            const existingIndex = newShoppingList.ingredients.findIndex(item => item.ingredient_id === ingredientId);
            if (existingIndex > -1) {
                const updatedIngredients = [...newShoppingList.ingredients];
                updatedIngredients[existingIndex] = ingredientData;
                setNewShoppingList({ ...newShoppingList, ingredients: updatedIngredients });
            } else {
                setNewShoppingList({ ...newShoppingList, ingredients: [...newShoppingList.ingredients, ingredientData] });
            }
        } else {
            const existingIndex = updateShoppingList.ingredients.findIndex(item => item.ingredient_id === ingredientId);
            if (existingIndex > -1) {
                const updatedIngredients = [...updateShoppingList.ingredients];
                updatedIngredients[existingIndex] = ingredientData;
                setUpdateShoppingList({ ...updateShoppingList, ingredients: updatedIngredients });
            } else {
                setUpdateShoppingList({ ...updateShoppingList, ingredients: [...updateShoppingList.ingredients, ingredientData] });
            }
        }

    };

    const handleCreateNewList = async (event) => {
        event.preventDefault()
        console.log(newShoppingList)
        let getNewShoppingList = newShoppingList
        let ingIDArray = []
        for (const ingredient of newListIngredients) {
            ingIDArray.push(ingredient.ingredient)
        }

        getNewShoppingList.ingredients_list = ingIDArray
        getNewShoppingList.user = 1
        console.log(getNewShoppingList)

        try{
        const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getNewShoppingList)
        })

        if (!response.ok) {
            const message = await response.json()
            throw new Error(`DB Error: ${response.status}: ${message}`)
        } else{

            const newList = await response.json()
            setNewShoppingList(newList)

            for (const ingredient of newListIngredients) {
                console.log(newList)
                const newShoppingListIngredient = {shopping_list: newList.shopping_id, ingredient: ingredient.ingredient, quantity: ingredient.quantity}
                console.log(newShoppingListIngredient)
                    const res = await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newShoppingListIngredient)
                    })
            }
        }
        } catch (error) {
            console.log(error)
        }
        setNewShoppingList({
            name: '',
            user: 1, // THIS WILL NEED TO BECOME THE USER STATE FOR THE USER'S ID
            ingredients_list: [],
        })
        setNewListIngredients([])

        const res = await fetch(`http://18.234.134.4:8000/api/shoppinglist`);
        const shopList = await res.json();
        setShoppingLists(shopList);
    
        const resIngredients = await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`);
        const updatedIngredients = await resIngredients.json();
        setShoppingListIngredients(updatedIngredients);

        setCreateListView(false)
    }

    const updateShoppingListIngredient = (event) => {
        event.preventDefault();
        if (updateListIngredients.length === 0) {
            console.log('add first')
            setUpdateListIngredients([{ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])
        } else {
            console.log('regular add')
            setUpdateListIngredients(prev => [...prev, {ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])
        }
    }

    const removeUpdateShoppingListIngredient = (event, ingIndex) => {
        event.preventDefault();
        const remove = updateListIngredients.filter((_, index) => index !== ingIndex)
        setUpdateListIngredients(remove)
    }

    const addShoppingListIngredient = (event) => {
        event.preventDefault();
        if (newListIngredients.length === 0) {
            console.log('add first')
            setNewListIngredients([{ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])
        } else {
            console.log('regular add')
            setNewListIngredients(prev => [...prev, {ingredient : allIngredients[0].ingredient_id, name : allIngredients[0].name_of_ingredient, quantity : 0}])
        }
    }

    const removeShoppingListIngredient = (event, ingIndex) => {
        event.preventDefault();
        const remove = newListIngredients.filter((_, index) => index !== ingIndex)
        setNewListIngredients(remove)
    }

    const handleUpdateShoppingList = async (event) => {
        event.preventDefault();
        try {
          // Step 1: Update the shopping list name
          const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/${updateShoppingList.shopping_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: updateShoppingList.name,
                user: updateShoppingList.user,  
                ingredients_list: updateListIngredients.map(i => i.ingredient)
            })
          });
      
          if (!response.ok) {
            const msg = await response.json();
            throw new Error(`Update error: ${msg}`);
          }
      
          // Deletes all existing shoppinglistingredient entries in list to clean up
          const deletePromises = shoppingListIngredients
            .filter(i => i.shopping_list === updateShoppingList.shopping_id)
            .map(i =>
              fetch(`http://18.234.134.4:8000/api/shoppinglistingredient/${i.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              })
            );
          await Promise.all(deletePromises);
      
          // Add new ingredient rows into object
          for (const ingredient of updateListIngredients) {
            const newItem = {
              shopping_list: updateShoppingList.shopping_id,
              ingredient: ingredient.ingredient,
              quantity: ingredient.quantity
            };
            await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newItem)
            });
          }
      
          // Refresh on submission
          const res = await fetch(`http://18.234.134.4:8000/api/shoppinglist`);
          const shopList = await res.json();
          setShoppingLists(shopList);
      
          const resIngredients = await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`);
          const updatedIngredients = await resIngredients.json();
          setShoppingListIngredients(updatedIngredients);
      
          setUpdateListView(false);
        } catch (error) {
          console.error("Error updating shopping list:", error);
        }
      };

    const handleDeleteList = async (event) => {
        console.log(event.shopping_id)
        await fetch(`http://18.234.134.4:8000/api/shoppinglist/${event.shopping_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setShoppingLists(prevLists => prevLists.filter(list => list.shopping_id !== shoppingList.shopping_id)); // Update in App
    };

    return(
        <>
            {updateListView == false && createListView == false ?
                <>
                    <h1 className='text-8xl p-5 m-2 bg-teal-700/75 rounded-full'>Prepare your own mixology event</h1>
                    {/* HERO FOR CREATING A NEW SHOPPING LIST */}
                    <div className='flex justify-around gap-5 m-10 p-10 bg-gray-800/95'>
                        <section>
                            <h2 className='text-6xl pb-10'>Build your mixology list!</h2>
                            <p className='text-2xl text-left italic'>Preparing for an event is always a lot of work, especially when it comes to organizing and preparing drinks!  Use this to help organize and plan out what you need to buy!</p>
                        </section>
                        <section className='flex align-center'>
                            <button className='p-2 m-2 text-4xl font-bold shadow-2xl-bg-teal-200 bg-yellow-600 hover:cursor-pointer hover:bg-yellow-800 rounded-full' onClick={(() => (setCreateListView(true), setUpdateListView(false)))}>Start here to prepare your new event!</button>
                        </section>
                    </div>
                    <div className='bg-teal-700/60 m-5'>
                        <h2 className='text-6xl py-10 bg-orange-600/60 rounded-ee-full'>Your Event Lists:</h2>
                        <div className='flex flex-wrap justify-around'>
                        {userShoppingLists.map((shoppinglist) => (
                            <div className='p-5 m-5 min-w-100 w-100 min-h-100 h-auto flex flex-col justify-evenly bg-gradient-to-br rounded-lg from-cyan-400 to-purple-600' key={shoppinglist.shopping_id}>
                                <div className='rounded-full bg-black/50 py-10 mx-5'>
                                    <h3 className='text-4xl p-2 m-2'>{shoppinglist.name}</h3>
                                    <h3 className='text-3xl p-2 m-2'>Ingredients List</h3>
                                    {shoppingListIngredients.filter((listIngredient) => listIngredient.shopping_list === shoppinglist.shopping_id).map((listIngredient) => (
                                        allIngredients.filter((ingredient) => ingredient.ingredient_id === listIngredient.ingredient).map((ingredient) => (
                                            <p key={ingredient.ingredient_id}>{ingredient.name_of_ingredient} Quantity: {listIngredient.quantity}</p>
                                        ))
                                    ))}
                                </div>
                                <div className='flex justify-between'>
                                {/* Update Shopping List */}
                                <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' onClick={() => {
                                    setCreateListView(false);
                                    setUpdateListView(true);

                                    const selectedIngredients = shoppingListIngredients
                                        .filter((ingredients) => ingredients.shopping_list === shoppinglist.shopping_id)
                                        .map((ing) => ({
                                            ingredient: ing.ingredient,
                                            quantity: ing.quantity,
                                            name: allIngredients.find(a => a.ingredient_id === ing.ingredient)?.name_of_ingredient || ''
                                        }))

                                    setUpdateShoppingList({
                                        ...shoppinglist,
                                        ingredients_list: selectedIngredients.map(({ingredient}) => ingredient)
                                    });

                                    setUpdateListIngredients(selectedIngredients)

                                }}>Update Shopping List</button>

                                {/* Delte Shopping List */}
                                <button className='p-2 m-2 font-bold bg-red-500 hover:cursor-pointer hover:bg-red-700 rounded-full' onClick={(() => handleDeleteList(shoppinglist))}>Delete {shoppinglist.name}</button>
                            </div>
                        </div>
                        ))}
                        </div>
                    </div>
                </>
            :
                <></>
            }

            {createListView == true ? 
                <>
                <div>
                    <h2 className='text-8xl p-5 m-2 bg-teal-700/75 rounded-full'>Create New Event List:</h2>
                    <form className='p-10 m-5 w-auto h-auto flex flex-col justify-evenly bg-gradient-to-tr from-red-400/90 to-purple-600/60'>
                        <section className='flex justify-center'>
                            <label className='font-[tagesschrift-regular] text-6xl mr-10' name='name'>List Name: </label>
                            <input className='text-4xl text-black bg-white/50 pl-5 w-150' name='name' value={newShoppingList.name} onChange={handleChange} placeholder='Write Here'></input>
                        </section>
                        <section className='bg-gray-500/70 my-5 rounded-xl px-20'>
                            <button className='p-5 m-5 font-bold text-3xl bg-green-500 hover:cursor-pointer hover:bg-green-700 rounded-full' onClick={addShoppingListIngredient}>Add Ingredient</button>
                            {newListIngredients.map((ingredient, index) => (
                                <div className='pb-10 flex justify-evenly items-center' key={index}>
                                    <div className='flex'>
                                        <label className='font-[tagesschrift-regular] text-4xl mr-10' htmlFor={`ingredient ${index}`}>Ingredient: </label>
                                        <select className='bg-black/25 font-[tagesschrift-regular] text-2xl text-center w-50' name={`ingredient ${index}`} value={ingredient.ingredient}
                                            onChange={(event) => {
                                                let tempShoppingListIngredients = [...newListIngredients];
                                                tempShoppingListIngredients[index] = { ...tempShoppingListIngredients[index], ingredient: parseInt(event.target.value, 10) };
                                                setNewListIngredients(tempShoppingListIngredients);
                                            }}>
                                            {allIngredients.map((globalIngredient, index) => (
                                                globalIngredient.ingredient_id === ingredient.ingredient
                                                    ? <option key={index} value={globalIngredient.ingredient_id}> {globalIngredient.name_of_ingredient} </option>
                                                    : <option key={index} value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex'>
                                        <label className='font-[tagesschrift-regular] text-4xl mr-5' htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                                        <input className='bg-black/25 font-[tagesschrift-regular] text-2xl text-center w-50' type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity ?? 0}
                                            onChange={(event) => {
                                                const tempIngredients = [...newListIngredients];
                                                tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                                setNewListIngredients(tempIngredients);
                                            }} >
                                        </input>
                                    </div>
                                    <button className='p-2 m-2 font-bold text-xl bg-red-500 hover:cursor-pointer hover:bg-red-700 rounded-full' onClick={(event) => removeShoppingListIngredient(event, index)}>Remove Ingredient</button>
                                </div>
                            ))}
                        </section>

                        <section className='flex flex-col align-center w-auto'>
                            <button className='p-2 m-2 font-bold text-4xl bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' type="submit" onClick={handleCreateNewList}>Create '{newShoppingList.name}' Event List</button>
                            <button className='p-2 m-2 font-bold text-2xl bg-gray-500 hover:cursor-pointer hover:bg-gray-700 rounded-full' onClick={(() => (
                            setCreateListView(false),
                            setUpdateListView(false),
                            setNewListIngredients([]),
                            setNewShoppingList({
                                shopping_id: null,
                                name: '',
                                ingredients_list: [],
                            }
                            )))}>Return to Event Shopping Lists</button>
                        </section>

                    </form>
                </div>
                </>
            :
                <></>
            }

            {updateListView == true ?
                <>
                    <h2 className='text-8xl p-5 m-2 bg-teal-700/75 rounded-full'>Edit '{updateShoppingList.name}'</h2>
                    <form className='p-10 m-5 w-auto h-auto flex flex-col justify-evenly bg-gradient-to-tr from-red-400/90 to-purple-600/60'>
                        <section className='flex justify-center'>
                            <label className='font-[tagesschrift-regular] text-6xl mr-10' name='name'>Update Event List Name: </label>
                            <input className='text-4xl text-black bg-white/50 pl-5 w-150' name='name' value={updateShoppingList.name} onChange={handleChange}></input>
                        </section>
                        <section className='bg-gray-500/70 my-5 rounded-xl px-20'>
                            <button className='p-5 m-5 font-bold text-3xl bg-green-500 hover:cursor-pointer hover:bg-green-700 rounded-full' onClick={updateShoppingListIngredient}>Add Ingredient</button>
                                {updateListIngredients.map((ingredient, index) => (
                                <div className='pb-10 flex justify-evenly items-center' key={index}>
                                    <div className='flex'>
                                        <label className='font-[tagesschrift-regular] text-4xl mr-10' htmlFor={`ingredient ${index}`} >Ingredient: </label>
                                        <select className='bg-black/25 font-[tagesschrift-regular] text-2xl text-center w-50' name={`ingredient ${index}`} value={ingredient.ingredient}
                                            onChange={(event) => {
                                                let tempShoppingListIngredients = [...updateListIngredients];
                                                tempShoppingListIngredients[index] = { ...tempShoppingListIngredients[index], ingredient: parseInt(event.target.value, 10) };
                                                setUpdateListIngredients(tempShoppingListIngredients);
                                            }}>
                                            {allIngredients.map((globalIngredient, index) => (
                                                globalIngredient.ingredient_id === ingredient.ingredient
                                                    ? <option key={index} value={globalIngredient.ingredient_id}> {globalIngredient.name_of_ingredient} </option>
                                                    : <option key={index} value={globalIngredient.ingredient_id}>{globalIngredient.name_of_ingredient}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex'>
                                        <label className='font-[tagesschrift-regular] text-4xl mr-5' htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                                        <input className='bg-black/25 font-[tagesschrift-regular] text-2xl text-center w-50' type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity ?? 0}
                                            onChange={(event) => {
                                                const tempIngredients = [...updateListIngredients];
                                                tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                                setUpdateListIngredients(tempIngredients);
                                            }}>
                                        </input>
                                    </div>
                                    <button className='p-2 m-2 font-bold text-xl bg-red-500 hover:cursor-pointer hover:bg-red-700 rounded-full' onClick={(event) => removeUpdateShoppingListIngredient(event, index)}>Remove Ingredient</button>
                                </div>
                                ))}
                        </section>

                        <section className='flex flex-col align-center w-auto'>
                            <button className='p-2 m-2 font-bold text-4xl bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full'  type="submit" onClick={handleUpdateShoppingList}>Update '{updateShoppingList.name}' Event List</button>
                            <button className='p-2 m-2 font-bold text-2xl bg-gray-500 hover:cursor-pointer hover:bg-gray-700 rounded-full' onClick={(() => (
                            setCreateListView(false),
                            setUpdateListView(false),
                            setUpdateListIngredients([]),
                            setUpdateShoppingList({
                                shopping_id: null,
                                name: '',
                                ingredients_list: [],
                            }
                            )))}>Return to Event Lists</button>
                        </section>
                    </form>
                </>
            :
                <></>
            }
        </>
    );
};

export default ShoppingList;
