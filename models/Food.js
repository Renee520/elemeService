const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const foodSchema = new Schema({
  menus: [{
    type: ObjectId,
    ref: 'FoodMenu',
  }],
  store: {
    type: ObjectId,
    ref: 'Store',
  },
  description: String,
  name: String,
  hotLevel: {
    type: Number,
    default: 0,
  }, // 辣度
  price: {  // 价格
    type: Number,
    default: 0,
  },
  quantity: Number,
  feedstock: String, // 主要原料
  rate: Number, // 好评率
  monthSales: Number, // 月售
  recommend: {  // 店长推荐
    type: Boolean,
    default: false,
  },
  valid: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
module.exports =  Food;