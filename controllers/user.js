var User = require('../models/User');
var MobileCode = require('../models/MobileCode');
var util = require('../util');
var moment = require('moment');

function index(req, res, next) {
  res.send('respond with a resource');
};

function login(req, res, next) {
  let user = null;
  const { mobile, code } = req.body;
  User.findOne({
    mobile,
  }).then(
    res => {
      if (!res) {
        // 注册
        return register(mobile);
      }
      return Promise.resolve(res);
    }
  ).then(
    res => {
      user = res;
      return MobileCode.findOneAndUpdate({
        code,
        mobile,
        used: false,
        createdAt: {
          "$gt": new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`),
        }
      }, {
        '$set': {
          used: true,
          usedDate: new Date(),
        }
      }, {
        new: true
      });
    },
    err => Promise.reject(err)
  ).then(
    res => {
      // 验证码
      if (!res) {
        return Promise.reject('验证码不正确');
      }
      return Promise.resolve(user);
    },
    err => Promise.reject(err)
  ).then(
    result => {
      const { _id, name, mobile, latitude, longitude } = result;
      res.json({
        status: 1,
        user: {_id, name, mobile, latitude, longitude},
      })
    },
    err => {
      res.json({
        status: 0,
        msg: err,
      });
    }
  );
};

function register(mobile, name = '') {
  let userName = name;
  if (!name) {
    userName = `${mobile}-${util.getRandomName()}`;
  }
  const user = new User({
    name: userName,
    mobile,
  });
  return user.save();
}


module.exports = {
  login,
  index,
};