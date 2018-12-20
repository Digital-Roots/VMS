const mongoose = require('mongoose');
const bcrypt = require('bycrypt');
const StaffSchema = new mongoose.Schema({
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
    type: Number, default: '2',
    required: true,
    trim: true
  }
})
StaffSchema.statics.authenticate = function(email, password, callback){
  staff.findOne({email: email})
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

StaffSchema.pre('save', function(next){
  let staff = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    staff.password = hash;
    next()
  })
});


let staff = mongooose.model('staff', StaffSchema);
module.exports = staff;
