var util = require('../util');
var moment = require('moment');

function index(req, res, next) {
  res.redirect('/portal/shop/list');
};
function list(req, res, next) {
  res.render('shop/shopList');
};
function form(req, res, next) {
  res.render('shop/shopForm');
};

module.exports = {
  index,
  list,
  form,
};