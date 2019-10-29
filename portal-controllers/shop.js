var util = require('../util');
var moment = require('moment');
var Store = require('../models/Store');

function index(req, res, next) {
  res.redirect('/portal/shop/list');
};
function list(req, res, next) {
  res.render('shop/shopList');
};
function form(req, res, next) {
  res.render('shop/shopForm');
};
function save(req, res, next) {
  const { name } = req.body;
  Store.findOne({
    name,
  }).then(
    r => {
      if (r) {
        console.log('000', r);
        return Promise.reject('名称重复');
      }
      let data = req.body;
      data.valid = util.checkboxValue(data.valid, 'number');
      data.isSend = util.checkboxValue(data.isSend);
      data.isBrand = util.checkboxValue(data.isBrand);
      data.isNewStore = util.checkboxValue(data.isNewStore);
      data.isFoodEnsure = util.checkboxValue(data.isFoodEnsure);
      data.isFNSpecialDelivery = util.checkboxValue(data.isFNSpecialDelivery);
      data.invoice = util.checkboxValue(data.invoice);
      data.isPerfect = util.checkboxValue(data.isPerfect);
      data.selfTake = util.checkboxValue(data.selfTake);
      data.type = data.type.length ? data.type.split(',') : [];
      data.keyWord = data.keyWord.length ? data.keyWord.split(',') : [];
      const store = new Store(data);
      return store.save()
    },
    err => Promise.reject(err)
  ).then(
    r => {
      console.log(r);
      res.json({
        status: 1
      })
    },
    err => {
      res.json({
        status: 0,
        msg: err,
      })
    }
  )
}

module.exports = {
  index,
  list,
  form,
  save,
};