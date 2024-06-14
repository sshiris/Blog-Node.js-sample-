require('dotenv').config();// Load .env file

const express = require('express');// Import express.
const expressLayouts = require('express-ejs-layouts');// Import express-ejs-layouts
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const connectDB = require('./server/config/db');// Import connectDB function from db.js

const app = express();// Create express app, app is an object now, it has many methods
const port = process.env.PORT || 3000;// Define port, if no port is defined in .env file, then use 3000

connectDB();// Call connectDB function to connect database
const { isActiveRoute}= require('./server/helpers/routeHelpers'); // Import isActiveRoute function from routeHelpers.js

app.use(express.urlencoded({extended:true})); // Parse URL-encoded bodies
app.use(express.json());// Used to parse JSON bodies
app.use(cookieParser());// Use cookie parser
app.use(methodOverride('_method'));// Use method override
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL}),
    cookie:{maxAge: 3600000}
}));

app.use(express.static('public'));

//template engine
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('layout','./layouts/main'); 

app.locals.isActiveRoute = isActiveRoute;

// Middleware to set currentRoute
app.use((req, res, next) => {
    res.locals.currentRoute = req.path;
    next();
});

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})// Start server on port 3000, and print message on console.


