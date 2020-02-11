const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const foodMenuSchema = new Schema({
  name: String, // test
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

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);
module.exports =  FoodMenu;