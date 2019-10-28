var express = require('express');
var router = express.Router();
var userCtr = require('../../portal-controllers/user');
/* GET users listing. */
router.get('/', userCtr.index);
router.get('/findUser', userCtr.getUser);

module.exports = router;
