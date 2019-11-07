var express = require('express');
var router = express.Router();
var menuCtr = require('../../portal-controllers/menu');
/* GET users listing. */
router.get(['/form/:storeId', '/form/:storeId/:id'], menuCtr.form);
router.get('/edit/:storeId/:id', menuCtr.form);
router.get('/listData', menuCtr.listData);
router.post('/save', menuCtr.save);
router.post('/checkName', menuCtr.checkName);
router.get('/save-data', menuCtr.saveData);
router.get('/valid/:id', menuCtr.valid);
router.get('/food/:menuId', menuCtr.getFoodByMenu);
router.get('/del/:id', menuCtr.del);
router.get(['/', '/list', '/list/:storeId'], menuCtr.index);

module.exports = router;
