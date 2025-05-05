import { useState, useEffect } from 'react'

const ShoppingList = ({userShoppingLists, setShoppingLists, allIngredients, setAllIngredients}) => {

    const [shoppingListIngredients, setShoppingListIngredients] = useState([])
    const [createListView, setCreateListView] = useState(false)
    const [updateListView, setUpdateListView] = useState(false)

    const [newListIngredients, setNewListIngredients] = useState([])
    const [updateListIngredients, setUpdateListIngredients] = useState([])

    const [newShoppingList, setNewShoppingList] = useState({ ingredients_list: [] })

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

// setRecipeData = setNewShoppingList

    const handleChange = (event) => {
        event.preventDefault()
        setNewShoppingList({...newShoppingList, [event.target.name]: event.target.value})
        setUpdateShoppingList({...updateShoppingList, [event.target.name]: event.target.value})
    }

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
                'Content-Type': 'application/json'
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

    const handleDeleteList = async (event) => {
        console.log(event.shopping_id)
        await fetch(`http://18.234.134.4:8000/api/shoppinglist/${event.shopping_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const res = await fetch(`http://18.234.134.4:8000/api/shoppinglist`)
        const shopList = await res.json();
        setShoppingLists(shopList)
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
                user: updateShoppingList.user,  // replace with real user ID
                ingredients_list: updateListIngredients.map(i => i.ingredient)
            })
          });
      
          if (!response.ok) {
            const msg = await response.json();
            throw new Error(`Update error: ${msg}`);
          }
      
          // Step 2: Delete all existing shoppinglistingredient entries for this list
          const deletePromises = shoppingListIngredients
            .filter(i => i.shopping_list === updateShoppingList.shopping_id)
            .map(i =>
              fetch(`http://18.234.134.4:8000/api/shoppinglistingredient/${i.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              })
            );
          await Promise.all(deletePromises);
      
          // Step 3: Add new ingredient rows
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
      
          // Step 4: Refresh list data
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

    return(
        <>
            {updateListView == false && createListView == false ?
            <>
            <h1 className='text-8xl p-2 m-2'>Shopping List Page</h1>
            
            <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' onClick={(() => (setCreateListView(true), setUpdateListView(false)))}>Create New Shopping List</button>

            <h2 className='text-6xl p-2 m-2'>Your Shopping Lists:</h2>
            {userShoppingLists.map((shoppinglist) => (
                <div key={shoppinglist.shopping_id}>
                    <h3 className='text-4xl p-2 m-2'>{shoppinglist.name}</h3>
                    {shoppingListIngredients.filter((listIngredient) => listIngredient.shopping_list === shoppinglist.shopping_id).map((listIngredient) => (
                        allIngredients.filter((ingredient) => ingredient.ingredient_id === listIngredient.ingredient).map((ingredient) => (
                            <p key={ingredient.ingredient_id}>{ingredient.name_of_ingredient} Quantity: {listIngredient.quantity}</p>
                        ))
                    ))}
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
            ))}
            </>
            :<></>
            }
            {createListView == true ? 
            <>
            <h2 className='text-6xl p-2 m-2'>Create New Shopping List:</h2>
            <form>
                <label name='name'>New List Name: </label>
                <input name='name' value={newShoppingList.name} onChange={handleChange}></input>
                {newListIngredients.map((ingredient, index) => (
                        <div key={index}>
                            <label htmlFor={`ingredient ${index}`} >Ingredient: </label>
                            <select name={`ingredient ${index}`} value={ingredient.ingredient}
                                onChange={(event) => {
                                    let tempShoppingListIngredients = [...newListIngredients];
                                    tempShoppingListIngredients[index] = { ...tempShoppingListIngredients[index], ingredient: parseInt(event.target.value, 10) };
                                    setNewListIngredients(tempShoppingListIngredients);
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
                                    const tempIngredients = [...newListIngredients];
                                    tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                    setNewListIngredients(tempIngredients);
                                }} ></input>
                                
                            <button className='p-2 m-2 font-bold bg-red-500 hover:cursor-pointer hover:bg-red-700 rounded-full' onClick={(event) => removeShoppingListIngredient(event, index)}>Remove </button>
                        </div>
                    ))}
                <button className='p-2 m-2 font-bold bg-green-500 hover:cursor-pointer hover:bg-green-700 rounded-full' onClick={addShoppingListIngredient}>Add Ingredient</button>
                <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' type="submit" onClick={handleCreateNewList}>Submit New List</button>
            </form>
            </>
            :
            <></>
            }

            {updateListView == true ?
            <>
                <h2 className='text-6xl'>Update Shopping List:</h2>
                <form>
                <label name='name'>Update Name: </label>
                <input name='name' value={updateShoppingList.name} onChange={handleChange}></input>
                    {updateListIngredients.map((ingredient, index) => (
                    <div key={index}>
                        <label htmlFor={`ingredient ${index}`} >Ingredient: </label>
                        <select name={`ingredient ${index}`} value={ingredient.ingredient}
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
                        <label htmlFor={`ingredient ${index} quantity`}>Quantity: </label>
                        <input type="number" name={`ingredient ${index} quantity`} value={ingredient.quantity ?? 0}
                            onChange={(event) => {
                                const tempIngredients = [...updateListIngredients];
                                tempIngredients[index].quantity = parseInt(event.target.value, 10);
                                setUpdateListIngredients(tempIngredients);
                            }} ></input>
                            
                        <button className='p-2 m-2 font-bold bg-red-500 hover:cursor-pointer hover:bg-red-700 rounded-full' onClick={(event) => removeUpdateShoppingListIngredient(event, index)}>Remove </button>
                    </div>
                    ))}
                <button className='p-2 m-2 font-bold bg-green-500 hover:cursor-pointer hover:bg-green-700 rounded-full' onClick={updateShoppingListIngredient}>Add Ingredient</button>
                <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full'  type="submit" onClick={handleUpdateShoppingList}>Update List</button>
                <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' onClick={(() => (
                setCreateListView(false),
                setUpdateListView(false),
                setUpdateShoppingList({
                    shopping_id: null,
                    name: '',
                    ingredients_list: [],
                }
                )))}>Return</button>
                </form>
            </>
            :
            <></>
            }
        </>
    )
}

export default ShoppingList