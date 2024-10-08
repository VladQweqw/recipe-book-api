const Recipe = require("../models/recipeModel");
const fs = require('fs')
const path = require('path')

async function post_recipe(req, res) {    
    req.body.stepImages = [];
    const base_url = 'http://192.168.1.69:3003/public/recipe_images/';
    try {    
        
        let img_path = `${base_url}${req.files.thumbnailImage[0].filename}`;
        req.body.thumbnailImage = img_path;
        
        if(req.files.stepImages) {
            req.files.stepImages.forEach((image) => {
                req.body.stepImages.push(
                    `${base_url}${image.filename}`
                );
            })
        }

        const recipe = await Recipe.create(req.body);
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
        detail: 'Recipe succesfully created!'
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

function get_latest_recipe(req, res) {
    
    try {
        Recipe.findOne().sort({_id: -1}).exec()
        .then((respnse) => {
            res.status(200).json({
                detail: respnse
            })
        })
    }
    catch(err) {
        res.status(500).json({
            error: "No data probably"
        })
    }
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

    Recipe.findById(recipe_id).then((result) => {
        if(!result) {
            return res.status(400).json({
                detail: `Invalid recipe id`
            })
        }
        
        const unlinkedPromises = [];
        result?.stepImages.push(result.thumbnailImage)
        if(result?.stepImages) {
            result.stepImages.forEach((img_path) => {
                if(!img_path) return;
                
                const file_name = img_path.split('/').pop()
                const file_path = path.join(__dirname, "..", 'public', 'recipe_images', file_name);
                console.log(file_path);
                
                unlinkedPromises.push(new Promise((resolve) => {
                    fs.unlink(file_path, (err) => {                    
                        if(err) {
                            console.log(`Image ${file_name} coult not be deleted`);    
                            resolve(false)                    
                        }else {                            
                            resolve(true)
                        }
                    })
                }))
            })
        }

        Promise.all(unlinkedPromises).then((results) => {
            const failedCount = results.filter(result => !result).length;
            
            if(failedCount > 0) {
                return res.status(500).json({
                    error: `Could not delete ${failedCount} images`
                })
            }else {
                result.deleteOne().then(() => {
                    return res.status(200).json({
                        detail: "Recipe deleted"
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        detail: "Recipe could not be deleted: " + err.message
                    });
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                detail: `Error while deleting images ${err}` 
            });
        })

    })
    .catch((err) => {
        return res.status(400).json({
            error: "Invalid id probably " + err 
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
    put_recipe,
    get_latest_recipe
}