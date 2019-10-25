var express = require('express');
var router = express.Router();
var moment = require('moment');
var usersRouter = require('./portal/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  const date = new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`);
  console.log(date);
  res.render('index', { title: 'Express', date });
});

module.exports = function(app) {
  app.use('/portal', router);
  app.use('/portal/user', usersRouter);
};
