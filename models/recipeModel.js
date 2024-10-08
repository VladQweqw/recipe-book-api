const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    ingredients: [{
        type: String,
        required: [true, ""]
    }],
    stepTexts: [{
        type: String,
        required: [true, "Please add a text"]
    }],
    stepImages: [{
        type: String,
    }],
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