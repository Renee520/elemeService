var MobileCode = require('../models/MobileCode');
var moment = require('moment');
// var async = require('async');

var util = require('../util');

function sendMobileCode(req, res, next) {
  const mobile = req.body.mobile;
  if (!mobile) {
    return res.json({
      status: 0,
      msg: '请输入手机号码',
    });
  }
  if (!util.isMobile(mobile)) {
    return res.json({
      status: 0,
      msg: '手机号码格式错误',
    });
  }
  MobileCode.findOne({
    name: mobile,
    used: false,
    createdAt: {
      "$gt": new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`),
    }
  }).then(
    res => {
      if (!res) {
        const code = parseInt(Math.random() * 1000000);
        const mobileCode = new MobileCode({
          mobile,
          code,
        });
        return mobileCode.save();
      }
      return { code: res};
    },
    err => {
      return Promise.reject(err);
    }
  ).then(
    res => {
      res.json({
        status: 1,
        code: res.code,
      });
    },
    err => {
      res.json({
        status: 0,
        msg: err,
      });
    }
  );
};

module.exports = {
  sendMobileCode, // 发送验证码
};