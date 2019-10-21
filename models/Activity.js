const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const activitySchema = new Schema({
  store: {
    type: ObjectId,
    ref: 'Store',
  },
  name: String,
  iconName: String,
  iconColor: {
    type: String,
    default: '#f07373',
  },
  attribute: {   // 规则
    type: Array,
    default: [],
  },
  valid: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema, 'activities');
module.exports =  Activity;