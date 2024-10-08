const mongoose = require('mongoose');
const express = require('express')
const recipeRouter = require('./routes/recipeRoutes');
const body_parser = require('body-parser')
const cors = require('cors')
const dbURI = "mongodb+srv://vladpoienariu:admin123@lists.5vhezvm.mongodb.net/recipes-book?retryWrites=true&w=majority&appName=lists";

const app = express()
const PORT = 3003
const domain = 'localhost'

mongoose.connect(dbURI)
.then((result) => {
    app.listen(PORT)

    console.log(`Succesfully connected to DB`);
    console.log(`Server started at http://${domain}:${PORT}`);
})
.catch((err) => {
    console.log(`Error while connecting to DB: ${err}`);
})

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3003', 
    'http://192.168.1.68:5173',
    'http://192.168.1.68:3003',
    'http://192.168.1.68:3003',
    domain + ":5173",
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200, // For legacy browser support
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};



app.use(cors(corsOptions))
app.use('/public/recipe_images', express.static('public/recipe_images'));
app.use(express.json())
app.use(body_parser.json())


app.use("/", recipeRouter);

app.get('*', cors(corsOptions))
app.post('*', cors(corsOptions))


