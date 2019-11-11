var express = require('express');
var router = express.Router();
var foodCtr = require('../../portal-controllers/food');
/* GET users listing. */
router.get(['/form/:storeId', '/form/:storeId/:id'], foodCtr.form);
router.get('/edit/:storeId/:id', foodCtr.form);
router.get('/listData', foodCtr.listData);
router.post('/save', foodCtr.save);
router.post('/checkName', foodCtr.checkName);
router.get('/recommend/:id', foodCtr.recommend);
router.get('/valid/:id', foodCtr.valid);
router.get('/del/:id', foodCtr.del);
router.get(['/', '/list', '/list/:storeId'], foodCtr.index);

module.exports = router;
