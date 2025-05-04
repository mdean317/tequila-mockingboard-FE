import { useState, useEffect } from 'react'

const ShoppingList = ({userShoppingLists, setShoppingLists, allIngredients, setAllIngredients}) => {

    const [shoppingListIngredients, setShoppingListIngredients] = useState({
        ingredient: []
    })

    const [newShoppingList, setNewShoppingList] = useState({
        name: '',
        ingredients_list: [],
    })

    const [updateShoppingList, setUpdateShoppingList] = useState({
        shopping_id: null,
        name: '',
        ingredients_list: [],
    })

    const [createListView, setCreateListView] = useState(false)
    const [updateListView, setUpdateListView] = useState(false)
    
    useEffect(() => {
        const getAllShoppingListIngredients = async () => {
            const res = await fetch(`http://18.234.134.4:8000/api/shoppinglistingredient`)
            const JSONdataShoppingListIngredients = await res.json()
            console.log(JSONdataShoppingListIngredients)
            setShoppingListIngredients(JSONdataShoppingListIngredients || []);
        }
        getAllShoppingListIngredients()
    }, []);

    const handleChange = (event) => {
        event.preventDefault()
        setNewShoppingList({...newShoppingList, [event.target.name]: event.target.value})
        setUpdateShoppingList({...updateShoppingList, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(newShoppingList)
        const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShoppingList)
        })
        const createdList = await response.json()
        setShoppingLists(prev => [...prev, createdList])
        setNewShoppingList({
            name: '',
            ingredients_list: [],
        })
        setCreateListView(false)
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
        event.preventDefault()
        console.log(updateShoppingList)
        const response = await fetch(`http://18.234.134.4:8000/api/shoppinglist/${updateShoppingList.shopping_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateShoppingList)
        })
        const res = await fetch(`http://18.234.134.4:8000/api/shoppinglist`)
        const shopList = await res.json();
        setShoppingLists(shopList)
        setUpdateListView(false)
    }

    return(
        <>
            {updateListView == false && createListView == false ?
            <>
            <h1 className='text-8xl p-2 m-2'>Shopping List Page</h1>
            
            <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' onClick={(() => (setCreateListView(true), setUpdateListView(false)))}>Create New Shopping List</button>

            <h2 className='text-6xl p-2 m-2'>Your Shopping Lists:</h2>
            {userShoppingLists.map((shoppinglist) => (
                <div key={shoppinglist.shopping_id}>
                    <h3 className='text-4xl p-2 m-2'>{shoppinglist.name} {shoppinglist.shopping_id}</h3>
                    {shoppingListIngredients.filter((listIngredient) => listIngredient.shopping_list === shoppinglist.shopping_id).map((listIngredient) => (
                        allIngredients.filter((ingredient) => ingredient.ingredient_id === listIngredient.ingredient).map((ingredient) => (
                            <p key={ingredient.ingredient_id}>{ingredient.name_of_ingredient} Quantity: {listIngredient.quantity}</p>
                        ))
                        
                    ))}
                    <p className='text-2xl p-2 m-2'>{}</p>
                    {/* Update Shopping List */}
                    <button className='p-2 m-2 font-bold bg-blue-500 hover:cursor-pointer hover:bg-blue-700 rounded-full' onClick={(() => (setCreateListView(false), setUpdateListView(true), setUpdateShoppingList(shoppinglist), console.log(shoppinglist)))}>Update Shopping List</button>
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
                <label name='name'>Update Name: </label>
                <input name='name' value={newShoppingList.name} onChange={handleChange}></input>
                <select name='ingredients_list' multiple value={newShoppingList.ingredients_list} onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setNewShoppingList({...newShoppingList, ingredients_list: selected})
                }}>
                    {allIngredients.map((ingredient) => (
                        <option key={ingredient.ingredient_id} name={ingredient.name_of_ingredient} value={ingredient.name_of_ingredient}>
                            {ingredient.name_of_ingredient}
                        </option>
                    ))}
                </select>
                <button type="submit"  onClick={handleSubmit}>Submit New List</button>
            </form>
            </>
            :
            <></>
            }

            {updateListView == true ?
            <>
            <h2 className='text-6xl'>Update Shopping List:</h2>
            <form>
                <label name='name'>Name: </label>
                <input name='name' value={updateShoppingList.name} onChange={handleChange}></input>
                <select name='ingredients_list' multiple value={updateShoppingList.ingredients_list} onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setUpdateShoppingList({...updateShoppingList, ingredients_list: selected})
                }}>
                    {allIngredients.map((ingredient) => (
                        <option key={ingredient.ingredient_id} name={ingredient.name_of_ingredient} value={ingredient.name_of_ingredient}>
                            {ingredient.name_of_ingredient}
                        </option>
                    ))}
                </select>
                <button type="submit"  onClick={handleUpdateShoppingList}>Submit New List</button>
            </form>
            </>
            :
            <></>
            }
        </>
    )
}

export default ShoppingList