const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const foodMenuSchema = new Schema({
  name: String,
  description: String,
  index: Number, // 排序
  store: {
    type: ObjectId,
    ref: 'Store',
  }
  
}, { timestamps: true });

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);
module.exports =  FoodMenu;