var express = require('express');
var router = express.Router();
var userCtr = require('../controllers/user');
/* GET users listing. */
router.get('/', userCtr.index);
router.post('/login', userCtr.login);

module.exports = router;
