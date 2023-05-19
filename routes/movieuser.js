const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('../models/userregister');
const Movie = require('../models/movierate');
const bcrypt = require('bcrypt');
const saltRounds = 6;
const jwt = require('jsonwebtoken');
const secretKey = 'sujalbhaiya';

router.use(cors());
router.use(express.json());

router.get('/',function(req,res){
  res.send('Hello world');
});

router.post('/register',async function(req,res){
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try{
        const hashedpd = await bcrypt.hash(password,saltRounds);
        const insertResult = await User.create({
            username:name,
            email:email,
            password:hashedpd,
            movies: []
        });
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = jwt.sign({ email: insertResult.email, exp: expirationTime }, secretKey);
        res.status(200).send({token});
    } catch(error){
        console.log(error);
        res.status(500).send("Internal server error or user already exists");
    }
});

router.post('/ratemovie',async function(req,res){
  console.log(req.body);
  let prev;
  try{
    const {email,moviename,movierating} = req.body;
    const user = await User.findOne({email:email});
    console.log(user);
    if(user.movies === null){
      user.movies.push({name:moviename,rating:movierating});
      await user.save();
      return res.status(200).json({message:'successfully updated'});
    }

    const existingMovieIndex = user.movies.findIndex(movie=>movie.name===moviename);
    if(existingMovieIndex>-1){
      prev = user.movies[existingMovieIndex].rating; 
      user.movies[existingMovieIndex].rating = movierating;
    } else{
      user.movies.push({name:moviename,rating:movierating});
    }
    await user.save();
    const movie = await Movie.findOne({moviename:moviename});
    if(!movie){
      const newMovie = new Movie({moviename:moviename,rating:movierating,frequency:1});
      await newMovie.save();
    } else{
      if(existingMovieIndex==-1){
        let freq = movie.frequency;
        let avg = (movie.rating*freq+movierating)/(freq+1);
        movie.rating = avg;
        movie.frequency = freq+1;
        await movie.save();
      } else{
        console.log(movierating);
        console.log(prev);
        let diff = movierating-prev;
        movie.rating = (movie.rating*movie.frequency+diff)/movie.frequency;
        console.log(movie.rating);
        await movie.save();
      }
    }

    return res.status(200).json({message:'successfully updated'});
  } catch(error){
    console.log('error',error);
    return res.status(500).json({message:'Internal server error'});
  }
});

router.post('/getRating',async function(req,res){
  try{
    const movie =await Movie.findOne({moviename:req.body.name});
    if(!movie){
      res.status(200).send({totrating:0});
    }
    else{
      res.status(200).send({totrating:movie.rating,voted:movie.frequency});
    }
  }
  catch(error){
    console.log(error);
  }
});

router.post('/getmyRating',async function(req,res){
  try{
    console.log(req.body);
    const {email,moviename} = req.body;
    const user = await User.findOne({email:email});
    console.log(user);
    if(user.movies === null){
      return res.status(200).json({myrating:-1});
    }
    const existingMovieIndex = user.movies.find(movie=>movie.name===moviename);
    if(existingMovieIndex){
       return res.status(200).send({myrating:existingMovieIndex.rating});
    } else{
      return res.status(200).send({myrating:-5});
    }
  }
  catch(error){
    console.log(error);
  }
});

router.post('/login',async function(req,res){
    try{
        const user = await User.findOne({email:req.body.email});
        console.log(user);
        if(user){
          const cmp = await bcrypt.compare(req.body.password,user.password);
          if(cmp){
            const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60); // Current time + 1 hour
            const token = jwt.sign({ email: user.email, exp: expirationTime }, secretKey);
            res.status(200).send({token});
          } else{
            res.status(401).send("Wrong username or password");
          }
        } else{
          res.status(401).send("Wrong username or password");
        }
      } catch(error){
        console.log(error);
        res.status(500).send("Internal Server error Occured");
      } 
});

module.exports = router;