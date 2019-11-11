const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const foodMenuSchema = new Schema({
  username: String,
  sex: Number, // 性别
  mobile: String,
  address: String,  // 地址
  addressDetail: String,  // 门牌号
  user: {
    type: ObjectId,
    ref: 'User'
  },
  tag: String, // 家、学校、公司
  valid: {
    type: Number,
    default: 1,
  }
  
}, { timestamps: true });

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);
module.exports =  FoodMenu;