const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const foodSchema = new Schema({
  menu: {
    type: ObjectId,
    ref: 'FoodMenu',
  },
  store: {
    type: ObjectId,
    ref: 'Store',
  },
  name: String,
  hotLevel: Number, // 辣度
  price: {  // 价格
    type: Number,
    default: 0,
  },
  quantity: Number,
  feedstock: String, // 主要原料
  valid: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
module.exports =  Food;