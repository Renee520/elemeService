var express = require('express');
var router = express.Router();
var indexCtr = require('../controllers');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  const date = new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`);
  console.log(date);
  res.render('index', { title: 'Express', date });
});
router.post('/sendCode', indexCtr.sendMobileCode);

module.exports = router;
