const mongoose = require('mongoose');
var moment = require('moment');
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
  createDate: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  // date: {
  //   type: Date,
  //   default: new Date(),
  // },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports =  User;