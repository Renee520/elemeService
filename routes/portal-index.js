var express = require('express');
var router = express.Router();
var moment = require('moment');
var usersRouter = require('./portal/user');
var shopRouter = require('./portal/shop');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/portal/user')
});

module.exports = function(app) {
  app.use('/portal', router);
  app.use('/portal/user', usersRouter);
  app.use('/portal/shop', shopRouter);
};
