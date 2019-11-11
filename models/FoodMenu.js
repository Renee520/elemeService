const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const addressSchema = new Schema({
  name: String,
  description: String,
  index: {
    type: Number,
    default: 0,
  }, // 排序
  store: {
    type: ObjectId,
    ref: 'Store',
  },
  valid: {
    type: Number,
    default: 1,
  }
  
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
module.exports =  Address;