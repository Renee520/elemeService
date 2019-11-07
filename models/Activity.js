const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const activitySchema = new Schema({
  store: {
    type: ObjectId,
    ref: 'Store',
  },
  name: String,
  description: String,
  iconName: String,
  iconSingleName: String, // 单字
  iconSingleBg: { // 单字背景
    type: String,
    default: '#f07373',
  },
  iconColor: {
    type: String,
    default: '#f07373',
  },
  iconBorder: {
    type: String,
    default: '#f07373',
  },
  attribute: String,  // 规则 {'30': '15'}:满30减15 1.5':下单立减1.5 null:其他规则
  exclusiveFood: { // false: 满减活动
    type: Boolean,
    default: true,
  },
  newUserOfSystem: {  // 新用户享用
    type: Boolean,
    default: false,
  },
  newUserOfStore: { // 本店新用户享用
    type: Boolean,
    default: false,
  },
  valid: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema, 'activities');
module.exports =  Activity;