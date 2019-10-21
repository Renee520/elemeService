const mongoose = require('mongoose');
const { Schema } = mongoose;

const MobileCodeSchema = new Schema({
  mobile: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const MobileCode = mongoose.model('MobileCode', MobileCodeSchema);
module.exports =  MobileCode;