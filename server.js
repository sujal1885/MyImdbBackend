const express = require('express');
const movieuser = require('./routes/movieuser');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

mongoose
.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log('Connected to Mongodb');
})
.catch((error)=>{
    console.log('Error connecting to mongodb',error);
});

app.use('/',movieuser);

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});