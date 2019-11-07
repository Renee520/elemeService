var express = require('express');
var router = express.Router();
var activityCtr = require('../../portal-controllers/activity');
/* GET users listing. */
router.get(['/form/:storeId', '/form/:storeId/:id'], activityCtr.form);
router.get('/edit/:storeId/:id', activityCtr.form);
// router.get('/list', activityCtr.list);
router.get('/listData', activityCtr.listData);
router.post('/save', activityCtr.save);
router.post('/checkName', activityCtr.checkName);
router.get('/save-data', activityCtr.saveData);
router.get('/valid/:id', activityCtr.valid);
router.get('/del/:id', activityCtr.del);
router.get(['/', '/list', '/list/:storeId'], activityCtr.index);

module.exports = router;
