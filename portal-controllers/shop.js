var util = require('../util');
var moment = require('moment');
var Store = require('../models/Store');
var data = require('../data/store');

function index(req, res, next) {
  res.redirect('/portal/shop/list');
};
function list(req, res, next) {
  res.render('shop/shopList');
};
function listData(req, res, next) {
  const { draw, filterKey, start, length, search, order } = req.query;
  let sort = util.orderFormat(order, req.query.columns);

  let searchKey = {};
  const reg = new RegExp(search.value, 'i');
  if (search.value) {
    searchKey = {'name': { $regex : reg }}
  }

  if (filterKey) {
    filterKey.split(',').forEach(f => {
      searchKey[f] = true;
    });
  }
  let count = 0;
  Store.count().then(
    r => {
      count = r;
      console.log(searchKey);
      return Store.find(searchKey).skip(Number(start)).limit(Number(length)).sort(sort);
    },
    err => Promise.reject(err)
  ).then(
    r => {
      res.json({
        status: 1,
        draw, 
        data: r,
        recordsFiltered: r.length,
        recordsTotal: count,
      })
    },
    err => {
      console.log('err', err);
      res.json({
        status: 0,
        data: []
      })
    }
  )
};
function form(req, res, next) {
  if (req.params.id) {
    Store.findById(req.params.id).then(
      r => {
        res.render('shop/shopForm', {shop: r});
      },
    )
  } else {
    res.render('shop/shopForm', {shop: new Store()});
  }
};
function save(req, res, next) {
  const { name, id } = req.body;
  Store.findOne({
    name,
  }).then(
    r => {
      if (r && !id) {
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
      if (id) {
        return Store.findOneAndUpdate({
          _id: id,
        }, {
          '$set': data,
        }, {
          new: true,
        });
      }
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

function checkName(req, res, next) {
  const { name, id } = req.body;
  let query = {name};
  if (id) {
    query._id = {'$ne': id};
  }
  Store.findOne(query).then(
    r => {
      if (r) {
        return res.json({
          valid: false,
        })
      }
      return res.json({
        valid: true,
      })
    },
    err => {
      return res.json({
        valid: false,
      })
    }
  )
}

function saveData(req, res, next) {
  Store.remove().then(
    () => {
      Store.collection.insert(data, function(err, dos) {
        res.redirect('/portal/shop/list')
      })
    },
    err => {
      res.redirect('/portal/shop/list')
    }
  )
}

module.exports = {
  index,
  list,
  form,
  save,
  checkName,
  listData,
  saveData,
};