const Recipe = require("../models/recipeModel");
const multer = require('multer');


// storage imge config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/public/recipe_images");
    },
    filename: (req, res, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

async function post_recipe(req, res) {    
    try {
        const recipe = await Recipe.create(req.body);
        console.log(recipe);
        
        recipe.save();
    }
    catch(err) {
        if(err.code === 11000) {
            return res.status(400).json({
                error: 'Recipe name already exists'
            })
        }
        return res.status(400).json({
            error: 'Invalid data sent.'
        })
    }

    return res.status(201).json({
        error: 'Recipe succesfully created!'
    })
}

function get_recipes(req, res) {
    let reverse = req.query.reverse;
    let category = req.query.category;
    const categories = ['meal', "breakfast", "deserts"]

    if(reverse == 'false') reverse = false;
        
    if(category && !categories.includes(category)) {
        return res.status(400).json({
            error: "Invalid category"
        })
    }else if(category) {
        category = category.charAt(0).toUpperCase() + category.slice(1)
        
        return Recipe.find({category: category}).then((result) => {        
            return res.status(200).json({
                data: reverse ? result.reverse() : result
            })
        })
        .catch((err) => {            
            return res.status(400).json({
                error: err
            })
        })
    }

    Recipe.find().then((result) => {        
        return res.status(200).json({
            data: reverse ? result.reverse() : result
        })
    })
    .catch((err) => {        
        return res.status(400).json({
            error: err
        })
    })
}

function get_individual_recipe(req, res) {
    const recipe_name = req.query.name;

    if(!recipe_name) {
        return res.status(400).json({
            error: "No recipe name provided"
        })
    }

    try {
        Recipe.findOne({title: {$regex: recipe_name, $options: 'i'}})
        .then((result) => {
            return res.status(200).json({
                data: result
            })
        })
        .catch((err) => {
            return res.status(400).json({
                error: "No recipe found, check the name"
            })
        })
    }
    catch(err) {
        return res.status(400).json({
            error: "No recipe name provided"
        })
    }
}

// finish
async function get_daily_recipe(req, res) {

    try {
        const randomRecipe = await Recipe.aggregate([
            {$sample: {size: 1}}
        ]);
    
        if(randomRecipe.length > 0) {
            res.status(200).json({
                data: randomRecipe[0]
            })
        }else {
            throw new Error("No recipes found")
        }
    }
    catch(err) {
        res.status(400).json({
            error: "Error getting recipe"
        })
    }
}

function delete_recipe(req, res) {
    const recipe_id = req.query.id;

    Recipe.findByIdAndDelete(recipe_id)
    .then((result) => {
        return res.status(200).json({
            detail: "Recipe deleted"
        })
    })
    .catch((err) => {
        return res.status(400).json({
            error: "Invalid id"
        })
    })

}

function put_recipe(req, res) {
    const recipe_id = req.query.id;

    Recipe.findByIdAndUpdate(recipe_id, req.body)
    .then((result) => {
        return res.status(200).json({
            detail: "Recipe updated"
        })
    })
    .catch((err) => {
        return res.status(400).json({
            error: "Invalid id / data sent"
        })
    })
}

module.exports = {
    get_recipes,
    get_individual_recipe,
    get_daily_recipe,
    post_recipe,
    delete_recipe,
    put_recipe
}