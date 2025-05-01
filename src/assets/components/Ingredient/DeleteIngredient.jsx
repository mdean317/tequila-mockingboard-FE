import React, {useState, useEffect} from "react";

const DeleteIngredient = ({ingredientId, onDeleteSuccess}) => {
    // const [deleteIngredient, setDeleteIngredient] = useState({ingredientId});
      
       const deleteIngredient = async () => {
            try {
            const response = await fetch(`http://18.234.134.4:8000/api/ingredient/${ingredientId}`, {
              method: "DELETE",
            });
      
            if (response.ok) {
              alert("Ingredient deleted successfully!");
              onDeleteSuccess(ingredientId);
            } else {
              alert("Failed to delete ingredient.");
            }
          } catch (error) {
            console.error("Error deleting ingredient:", error);
          }
        
      };


      return (
        <button onClick={deleteIngredient}>Delete Ingredient</button>
      );
      
}

export default DeleteIngredient;