const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/middleware");

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  LikedList,
  getAllLikedRecipes,
  removeFromLikedRecipes,
  searchRecipes,
  getRecipeById,
} = require("../controllers/RecipeController");

// Routes
router.post("/recipe", verifyToken, createRecipe); // Ensure verifyToken is applied here
router.get("/recipe", verifyToken, getAllRecipes);
router.get("/recipe/:id", verifyToken, getRecipeById); // Ensure this line is present
// router.get("/recipe/:id", (req, res)=>{
//   console.log(req.params);
//   return res.json("Everything okay")
// })
router.get("/likedRecipes", verifyToken, getAllLikedRecipes); // Ensure verifyToken is applied
router.delete("/recipe/:id", verifyToken, deleteRecipe); // Ensure verifyToken is applied
router.post("/likedRecipes/:id", verifyToken, LikedList); // Ensure verifyToken is applied
router.delete("/removeLiked/:id", verifyToken, removeFromLikedRecipes); // Ensure verifyToken is applied
router.get("/searchRecipes/:key", verifyToken, searchRecipes); // Ensure verifyToken is applied

module.exports = router;
