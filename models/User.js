const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    default: '0',
  },
  latitude: {
    type: String,
    default: '0',
  },
  // date: {
  //   type: Date,
  //   default: new Date(),
  // },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports =  User;