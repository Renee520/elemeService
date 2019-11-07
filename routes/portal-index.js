var express = require('express');
var router = express.Router();
var usersRouter = require('./portal/user');
var shopRouter = require('./portal/shop');
var activityRouter = require('./portal/activity');
var menuRouter = require('./portal/menu');
var foodRouter = require('./portal/food');
var indexRouter = require('./portal/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/portal/user')
});

module.exports = function(app) {
  app.use('/portal', router);
  app.use('/portal/user', usersRouter);
  app.use('/portal/shop', shopRouter);
  app.use('/portal/activity', activityRouter);
  app.use('/portal/menu', menuRouter);
  app.use('/portal/food', foodRouter);
  app.use('/portal/create', indexRouter);
};
