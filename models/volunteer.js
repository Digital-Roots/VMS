const mongoose = require('mongoose');
const VolSchema = new mongoose.Schema({
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
  region:{
    type: String,
    trim: true
  },
  parent:{
    type: String,
    required: true
  }
})

let vol = mongoose.model('vol', VolSchema);
module.exports = vol;
