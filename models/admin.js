const mongoose = require('mongoose');
const bcrypt = require('bycrypt');
const AdminSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone:{
    type: Number,
    required: true,
    trim: true,
    unique: true
  },
  name:{
    type: String,
    required: true,
    trim: true
  },
  password:{
    type: String,
    requiried: true
  },
  level:{
    type: Number, default: '1',
    required: true,
    trim: true
  }
})
AdminSchema.statics.authenticate = function(email, password, callback){
  admin.findOne({email: email})
      .exec(function(error, user){
        if(error){
          return callback(error);
        }else if(!user){
          let err = new Error('User not found');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, User.password, function(error, result){
          if(result === true){
            return callback(null, user);
          } else{
            return callback();
          }
        })
      })
}

AdminSchema.pre('save', function(next){
  let admin = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    admin.password = hash;
    next()
  })
});

let admin = mongooose.model('admin', AdminSchema);
module.exports = admin;
