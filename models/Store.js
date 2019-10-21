const mongoose = require('mongoose');
const { Schema } = mongoose;

const storeSchema = new Schema({
  name: String,
  isSend:{
    type: Boolean,
    default: true,
  },
  sendBasePrice: { // 起送价格
    type: Number,
    default: 0,
  },
  sendPrice: { // 配送费
    type: Number,
    default: 0,
  },
  isBrand: Boolean, // 品牌商家
  isNewStore: Boolean, // 新店
  isFoodEnsure: Boolean,  // 食安保
  isFNSpecialDelivery: Boolean, // 蜂鸟专送
  invoice: Boolean, // 开发票
  perSpend: {
    type: Number,
    default: 0,
  },
  selfTake: Boolean, // 支持自取
  keyWord: String, // 关键字，
  isPerfect: Boolean, // 口碑人气好店
  type: String, // 快餐类型
  longitude: {
    type: String,
    default: '0',
  },
  latitude: {
    type: String,
    default: '0',
  },
  description: String,
  promotionInfo: String, // 公告
  address: String,
  valid: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
module.exports =  Store;