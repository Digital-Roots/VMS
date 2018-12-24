const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  admin:{
    type: Boolean,
    required: true
  }
})
StaffSchema.statics.authenticate = function(email, password, callback) {
  Staff.findOne({ email: email })
      .exec(function (error, staff) {
        if (error) {
          return callback(error);
        } else if ( !staff ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, staff.password , function(error, result) {
          if (result === true) {
            return callback(null, staff);
          } else {
            return callback();
          }
        })
      });
}

StaffSchema.pre('save', function(next) {
  let staff = this;
  bcrypt.hash(staff.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    staff.password = hash;
    next();
  })
});


let Staff = mongoose.model('staff', StaffSchema);
module.exports = Staff;
