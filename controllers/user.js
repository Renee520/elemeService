var User = require('../models/User');
var MobileCode = require('../models/MobileCode');

function index(req, res, next) {
  User.findOne({
   name: 'dyy1',
    // date
  }).then(
    res => {
      console.log(res);
    }
  );
  res.send('respond with a resource');
};

function login(req, res, next) {
  const {mobile, code} = req.body;
  MobileCode.findOne({
    code,
    mobile,
    used: false,
    // date
  }).then(
    res => {
      if (!res) {
        return Promise.reject('验证码不正确');
      }
      return User.findOne({
        mobile,
      });
    },
    err => Promise.reject(err)
  ).then(
    res => {
      res.json({
        status: 1,
        user: res,
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

module.exports = {
  login,
  index,
};