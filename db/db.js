'use strict';

const url = 'mongodb://127.0.0.1:27017/eleme';
var mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log('\x1B[32m数据库连接成功\x1B[0m');
});

db.on('error', error => {
  console.log(`\x1B[31m数据路连接失败：${error}\x1B[0m`);
  mongoose.disconnect();
});

db.on('close', () => {
  console.log('\x1B[31m数据库断开，重新连接数据库\x1B[0m');
  mongoose.connection(url, {server: {auto_reconnect: true}});
});

module.exports = db;