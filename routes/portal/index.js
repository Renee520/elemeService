var express = require('express');
var router = express.Router();
var indexCtr = require('../../portal-controllers/index');
/* GET users listing. */
router.get('/', indexCtr.index);
router.get('/remove', indexCtr.remove);
router.get('/createdShopData', indexCtr.createdShopData);

module.exports = router;
