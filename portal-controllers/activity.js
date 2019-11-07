var util = require('../util');
var moment = require('moment');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
var Store = require('../models/Store');
var Activity = require('../models/Activity');
// var data = require('../data/store');

function index(req, res, next) {
  var storeId = req.params.storeId;
  if (!storeId) {
    return res.render('activity/activityList', { shop: null });
  }
  let store = {};
  Store.findById(storeId).then(
    r => {
      if (r) {
        store = r;
        return Activity.find({
          store: new ObjectId(storeId),
        });
      }
      Promise.reject('未找到门店')
    },
    err => Promise.reject(err)
  ).then(
    r => {
      console.log('================', r);
      res.render('activity/activityList', { shop: store });
    },
    err => res.render('error', {msg: err})
  )
};
function list(req, res, next) {
  res.render('shop/shopList');
};
function listData(req, res, next) {
  const { draw, filterKey, start, length, search, order, shopId } = req.query;
  let sort = util.orderFormat(order, req.query.columns);

  let searchKey = {};
  const reg = new RegExp(search.value, 'i');
  if (search.value) {
    searchKey = {'name': { $regex : reg }}
  }
  if (shopId) {
    searchKey.store = shopId;
  }

  if (filterKey) {
    filterKey.split(',').forEach(f => {
      searchKey[f] = true;
    });
  }
  let count = 0;
  Activity.count().then(
    r => {
      count = r;
      return Activity.find(searchKey).skip(Number(start)).limit(Number(length)).populate('store').sort(sort);
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
  var { storeId, id } = req.params;
  let shop = {};
  Promise.resolve().then(
    () => {
      if (storeId === '0') {
        return Promise.resolve({})
      }
      return Store.findById(storeId)
    }
  ).then(
    r => {
      if (r) {
        shop = r;
        if (id) {
          return Activity.findById(id);
        }
        return Promise.resolve(new Activity());
      }
      Promise.reject('未找到门店')
    },
    err => Promise.reject(err)
  ).then(
    activity => {
      console.log(activity);
      res.render('activity/activityForm', {shopStr: JSON.stringify({
        _id: shop._id,
        name: shop.name,
      }), shop, activity});
    },
    err => res.render('error', {msg: err})
  )
};
function save(req, res, next) {
  const { name, id } = req.body;
  if (!req.body.shops) {
    return res.json({
      status: 0,
      msg: '请选择商店',
    })
  }
  let data = req.body;
  data.exclusiveFood = util.checkboxValue(data.exclusiveFood);
  data.newUserOfSystem = util.checkboxValue(data.newUserOfSystem);
  data.newUserOfStore = util.checkboxValue(data.newUserOfStore);
  data.valid = util.checkboxValue(data.valid, 'number');
  data.shops = JSON.parse(data.shops);
  if (data.exclusiveFood) {
    if (!data.condition || !data.condition.length) {
      return res.json({
        status: 0,
        msg: '请填写规则',
      })
    }
    data.condition = JSON.parse(data.condition);
    data.reduce = JSON.parse(data.reduce);
    if (data.newUserOfSystem || data.newUserOfStore) {
      data.attribute = data.reduce || 0;
    } else {
      let attributeJson = {};
      for(let i=0; i<data.condition.length; i++) {
        let key = Number(data.condition[i]);
        let value = Number(data.reduce[i]);
        key = isNaN(key) ? 0 : key;
        value = isNaN(value) ? 0 : value;
        attributeJson[key] = value;
      }
      data.attribute = JSON.stringify(attributeJson);
    }
  }
  const shops = data.shops;
  delete data.condition;
  delete data.reduce;
  delete data.shops;
  let fns = [];
  // console.log(data);
  shops.forEach(item => {
    data.store = item.id;
    if (!id) {
      const activity = new Activity(data);
      fns.push(activity.save());
    } else {
      fns.push(
        Activity.findOneAndUpdate({
          _id: id,
        }, {
          '$set': data,
        }, {
          new: true,
        })
      )
    }
  })
  Promise.all(fns).then(
    r => {
      console.log(r);
      return res.json({
        status: 1,
      })
    },
    err => {
      console.log(err);
      return res.json({
        status: 0,
        msg: err,
      })
    }
  )
}

function checkName(req, res, next) {
  const { name, id, shop } = req.body;
  let shops = [];
  if (shop) {
    shops = JSON.parse(shop);
  }
  let query = {name};
  if (id) {
    query._id = {'$ne': id};
  }
  return res.json({
    valid: false,
  })
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

function valid(req, res, next) {
  const id = req.params.id;
  Activity.findById(id).then(
    r => {
      let v = r.valid === 1 ? 0 : 1;
      return Activity.update({_id: id}, {
        $set: {
          valid: v
        }
      })
    },
    err => Promise.reject(err)
  ).then(
    r => {
      res.redirect('back');
    },
    err => {
      res.render('error', {msg: err});
    }
  )
}

function del(req, res, next) {
  const id = req.params.id;
  console.log(id);
  Activity.findByIdAndRemove(id).then(
    r => {
      console.log(r);
      res.redirect('back');
    },
    err => {
      res.render('error', {msg: err});
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
  valid,
  del,
};