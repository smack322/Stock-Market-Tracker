const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../config/db');

//Config .emv tp ./config/config.env
require('dotenv').config({
    path: '../config/config.env'
})


//Connect to DB
connectDB();

const app = express();


//Config body parser
app.use(bodyParser.json());

//Config for development
if(process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL

    }))

    app.use(morgan('dev'))
    //Morgan give information about each request
    //Cors it's allow to deal with react for localhost at port 3000 without any problem
}

//Load all routes
const authRouter = require('../routes/authroute');

//Use routes
app.use('/api/', authRouter);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Page not found"
    })
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});