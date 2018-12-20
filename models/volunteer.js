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
    type: Sting,
    trim: true
  },
  parent:{
    type: String,
    required: true
  },
  level:{
    type: Number, default: '3',
    required: true,
    trim: true
  }
})

let vol = mongooose.model('admin', VolSchema);
module.exports = vol;
