var express = require('express');
var router = express.Router();
var storeCtr = require('../controllers/store');
var moment = require('moment');

/* GET home page. */
router.get('/getStore', storeCtr.getStore);
router.get('/:id', storeCtr.getStoreById);

module.exports = router;
