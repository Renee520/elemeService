const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const addressSchema = new Schema({
  username: String,
  sex: Number, // 性别 1:男 0：女
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

const Address = mongoose.model('Address', addressSchema);
module.exports =  Address;