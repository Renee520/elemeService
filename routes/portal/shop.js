var express = require('express');
var router = express.Router();
var shopCtr = require('../../portal-controllers/shop');
/* GET users listing. */
router.get('/', shopCtr.index);
router.get('/form', shopCtr.form);
router.get('/list', shopCtr.list);
router.get('/listData', shopCtr.listData);
router.post('/save', shopCtr.save);
router.post('/checkName', shopCtr.checkName);
router.get('/save-data', shopCtr.saveData);
router.get('/:id', shopCtr.form);

module.exports = router;
