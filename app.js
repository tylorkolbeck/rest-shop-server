const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

//Set up mongoose connection
var mongoDB = 'mongodb://localhost:27017/node-rest-shop';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// mongoose.connect("mongodb://localhost:27017/node-rest-shop/shop")

// Middleware //
app.use(morgan('dev')) // logs incoming requests
// https://www.npmjs.com/package/body-parser

// Middleware to make the uploads file public.
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({extended: false})) // parses url encoded bodies
app.use(bodyParser.json()) // parses json encoded bodies
// THIS IS FOR CORS HEADER SETTINGS
app.use((req, res, next) => {
    res.header('Access-Control_Allow-Origin', '*') // Allow cross server requests
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next() // Allow the request to continue to the routes
})


// Sets up a middleware which every request is funneled through and forwarded to routes
app.use('/products', productRoutes) 
app.use('/orders', orderRoutes) 
app.use('/user', userRoutes) 

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app