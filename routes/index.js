var express = require('express');
var router = express.Router();
var indexCtr = require('../controllers');
var moment = require('moment');
var usersRouter = require('./users');
var storeRouter = require('./store');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/portal/user')
});
router.post('/sendCode', indexCtr.sendMobileCode);

module.exports = function(app) {
  app.use('/', router);
  app.use('/user', usersRouter);
  app.use('/store', storeRouter);
};
