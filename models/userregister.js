const mongoose= require('mongoose');
require('mongoose-type-email');


const UserSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true
    },
    email:{
        type:mongoose.SchemaTypes.Email,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    movies: [
        {
          name: String,
          rating: Number
        }
      ]
 });


  const User = mongoose.model('User', UserSchema);
  module.exports = User;