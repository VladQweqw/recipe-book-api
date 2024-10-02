const { Router } = require('express');
const recipeController = require("../controller/recipeController")

const router = Router();

router.get('/', recipeController.get_recipes);
router.get('/daily', recipeController.get_daily_recipe);
router.get('/recipe', recipeController.get_individual_recipe);

router.post('/', recipeController.post_recipe);
router.delete('/', recipeController.delete_recipe);
router.put('/', recipeController.put_recipe);

module.exports = router;