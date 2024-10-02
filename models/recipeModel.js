const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stepSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    }
})

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    }
})

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please choose a title'],
        unique: true
    },
    category: {
        type: String,
        required: [true, "Please choose a category"]
    },
    totalTime: {
        type: Number,
        required: [true, "Please choose a total cooking time"]
    },
    lastingTime: {
        type: Number,
        required: [true, "Please choose a lasting time"]
    },
    cost: {
        type: Number,
        required: [true, "Please choose a price"]
    },
    thumbnailImage: {
        type: String,
        required: [true, 'Please choose an image']
    },
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    difficulty: {
        type: String,
        required: true,
        default: 'Easy',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true,
})


const Recipe = mongoose.model('recipe', RecipeSchema)
module.exports = Recipe