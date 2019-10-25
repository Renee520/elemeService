var User = require('../models/User');
var MobileCode = require('../models/MobileCode');
var util = require('../util');
var moment = require('moment');

function index(req, res, next) {
  res.send('respond with a resource');
};

module.exports = {
  index,
};