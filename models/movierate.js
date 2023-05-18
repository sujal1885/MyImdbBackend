const mongoose= require('mongoose');
require('mongoose-type-email');


const movieSchema = new mongoose.Schema({ 
    moviename:{
        type:String
    },
    rating:{
        type:Number,
        default:0
    },
    frequency:{
        type:Number,
        default:0
    }
 });


  const Movie = mongoose.model('Movie', movieSchema);
  module.exports = Movie;