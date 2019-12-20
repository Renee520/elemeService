var User = require('../models/User');
var Address = require('../models/Address');
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

function address(req, res) {
  const { userId } = req.query;
  Address.find({
    user: userId
  }).then(
    r => {
      res.json({
        status: 1,
        data: r
      })
    },
    err => res.json({
      status: 0,
      msg: err
    })
  )
}

function removeAddress() {
  const { userId, id } = req.query;
  Address.findOneAndDelete({
    user: userId,
    _id: id
  }).then(
    r => { 
      res.json({
        status: 1,
        data: r
      })
    },
    err => res.json({
      status: 0,
      msg: err
    })
  )
}

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

function setAddress(req, res) {

  try {
    
    const data = req.query;
    console.log(req.query);
    if (!data.userId) {
      return res.json({
        status: 0,
        msg: '请登录'
      })
    }
    if (!data.mobile || !util.isMobile(data.mobile)) {
      return res.json({
        status: 0,
        msg: '请输入正确的手机号'
      })
    }
    if (!data.address) {
      return res.json({
        status: 0,
        msg: '请输入地址'
      })
    }
  
    User.findById(data.userId).then(
      r => {
        if (r) {
          data.user = data.userId;
          delete data.user;
          const address = new Address(data);
          return address.save()
        }
        return Promise.reject('未找到用户')
      },
      err => Promise.reject(err)
    ).then(
      r => {
        res.json({
          status: 1,
        })
      },
      err => res.json({
        status: 0,
        msg: err
      })
    );
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  login,
  index,
  address, // 获取当前地址
  removeAddress,
  setAddress, // 保存地址
};