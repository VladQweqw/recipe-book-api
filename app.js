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

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:3003', 
        'http://192.168.1.69:3000',
        'http://192.168.1.69:3003',
        'http://192.168.1.68:3000',
        'http://192.168.1.68:3003',
        domain + ':3000',
        domain + ":3003",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': true,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': "*",
}



app.use(cors(corsOptions))
app.use('/public/recipe_images', express.static('public/recipe_images'));
app.use(express.json())
app.use(body_parser.json())


app.use("/", recipeRouter);

app.get('*', cors(corsOptions))
app.post('*', cors(corsOptions))


