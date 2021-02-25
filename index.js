const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var cors = require('cors')
//Import Routes
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contactRoute');

dotenv.config();
const port = process.env.PORT || 8080;

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connect to DB')
);

//Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/contact', contactRoute);

app.listen(port, () => console.log(`Server is running at port ${port}`))