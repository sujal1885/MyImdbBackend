const express = require('express');
const movieuser = require('./routes/movieuser');
const mongoose = require('mongoose');

const app = express();

mongoose
.connect('mongodb://127.0.0.1:27017/Imdbdatabase',{
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