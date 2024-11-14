import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import "../styles/Searchbar.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/recipe`, {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe data");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch recipes. Please try again.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/recipe/${recipeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
        } else {
          toast.error("Failed to delete the recipe");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the recipe.");
      }
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/likedRecipes/${recipeId}`, {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");
        setTimeout(() => {
          window.location.href = "/favouriteRecipes";
        }, 4000);
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already exists in your favorites");
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const SearchRecipes = async (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/searchRecipes/${searchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const searchedRecipes = await response.json();
        if (response.ok) {
          setRecipes(searchedRecipes);
        } else {
          setRecipes([]);
        }
      } catch (e) {
        console.log(e.message);
      }
    } else {
      getRecipes();
    }
  };

  const goToRecipePage = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={SearchRecipes}
        />
      </div>
      <div className="allreciepe">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="Recipe-container">
              <div className="image">
                <h2>{recipe.title}</h2>
                <img src={recipe.imageUrl} alt={recipe.title} />
              </div>

              <button
                className="view-details-button"
                onClick={() => goToRecipePage(recipe._id)}
              >
                View Details
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteRecipe(recipe._id)}
              >
                Delete
              </button>
              <button
                className="add-to-favorites-button"
                onClick={() => handleAddToFavorites(recipe._id)}
              >
                Add to Favorites
              </button>

              <Link to={"/addRecipe"}><button className="add-to-favorites-button">Add more recipes</button></Link>
            </div>
          ))
        ) : (
          <h2 className="no-recipes">No Recipes Found</h2>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Recipes;
