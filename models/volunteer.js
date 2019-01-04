const mongoose = require('mongoose');
const mongooseToCsv = require('mongoose-to-csv');
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

VolSchema.plugin(mongooseToCsv,{
  headers: 'Name Phone  Email Region',
  constraints:{
    'Name': 'name',
    'Phone': 'phone',
    'Email': 'email',
    'Region': 'region'
  }
});

let vol = mongoose.model('vol', VolSchema);
module.exports = vol;
