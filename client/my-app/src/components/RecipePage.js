import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipePage.css";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const getRecipeDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/recipe/${id}`, {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch recipe details: ${errorDetails}`);
        }

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    getRecipeDetails();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-page-container">
      <h1 className="recipe-title">{recipe.title}</h1>
      <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />

      <div className="recipe-details">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h3>Instructions:</h3>
        {recipe.instructions.match(/^\d+\./) ? (
          <div className="instructions-text">
            {recipe.instructions.split("\n").map((step, index) => (
              <p key={index}>{step}</p>
            ))}
          </div>
        ) : (
          <ol className="instructions-list">
            {recipe.instructions.split("\n").map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
