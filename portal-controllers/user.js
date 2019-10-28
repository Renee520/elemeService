var User = require('../models/User');
var MobileCode = require('../models/MobileCode');
var util = require('../util');
var moment = require('moment');

function index(req, res, next) {
  res.render('user/findUser');
};
function getUser(req, res, next) {
  User.find().then(
    result => {
      res.json({
        status: 1,
        data: result,
      });
    },
    err => {
      res.json({
        status: 0,
        data: [],
      })
    }
  )
};

module.exports = {
  index,
  getUser,
};