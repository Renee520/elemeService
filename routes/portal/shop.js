var express = require('express');
var router = express.Router();
var shopCtr = require('../../portal-controllers/shop');
/* GET users listing. */
router.get('/', shopCtr.index);
router.get('/form', shopCtr.form);
router.get('/list', shopCtr.list);

module.exports = router;
