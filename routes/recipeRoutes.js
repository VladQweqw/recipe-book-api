const { Router } = require('express');
const recipeController = require("../controller/recipeController")
const router = Router();
const path = require('path')

const multer = require('multer');

// storage imge config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/recipe_images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });


router.get('/', recipeController.get_recipes);
router.get('/daily', recipeController.get_daily_recipe);
router.get('/recipe', recipeController.get_individual_recipe);
router.get("/latest", recipeController.get_latest_recipe)

router.post('/', upload.fields([
    { name: 'thumbnailImage', maxCount: 1},
    { name: 'stepImages', maxCount: 10, },
]), recipeController.post_recipe);
router.delete('/', recipeController.delete_recipe);
router.put('/', recipeController.put_recipe);

module.exports = router;