var util = require('../util');
var Store = require('../models/Store');
var Food = require('../models/Food');
var FoodMenu = require('../models/FoodMenu');

function index(req, res, next) {
  var storeId = req.params.storeId;
  if (!storeId) {
    return res.render('error', { msg: '请选择门店' });
  }
  let store = {};
  Store.findById(storeId).then(
    r => {
      if (r) {
        store = r;
      }
      res.render('food/foodList', { shop: store });
    },
    err => res.render('error', {msg: err})
  );
};
function listData(req, res, next) {
  const { draw, start, length, search, order, shopId } = req.query;
  let sort = util.orderFormat(order, req.query.columns);

  let searchKey = {};
  const reg = new RegExp(search.value, 'i');
  if (search.value) {
    searchKey = {'name': { $regex : reg }}
  }
  if (shopId) {
    searchKey.store = shopId;
  }
  console.log(searchKey);
  let count = 0;
  Food.count().then(
    r => {
      count = r;
      return Food.find(searchKey).skip(Number(start)).limit(Number(length)).populate('store menu').sort(sort);
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
  let nemus = [];
  if (!storeId) {
    return res.render('error', {msg: '请选择门店'})
  }
  Store.findById(storeId).then(
    r => {
      if (r) {
        shop = r;
      }
      return FoodMenu.find({
        store: storeId,
      });
    },
    err => Promise.reject(err)
  ).then(
    menu => {
      menus = menu;
      if (id) {
        return Food.findById(id);
      }
      return Promise.resolve(new Food());
    },
    err => Promise.reject(err)
  ).then(
    food => {
      res.render('food/foodForm', {shopStr: JSON.stringify(shop), shop, food, menus});
    },
    err => res.render('error', {msg: err})
  )
};
function save(req, res, next) {
  const { id } = req.body;
  if (!req.body.store) {
    return res.json({
      status: 0,
      msg: '请选择商店',
    })
  }
  let data = req.body;
  data.valid = util.checkboxValue(data.valid, 'number');
  data.recommend = util.checkboxValue(data.recommend);
  if (!id) {
    const food = new Food(data);
    food.save().then(
      r => {
        res.json({
          status: 1
        })
      },
      err => res.json({
        status: 0,
        msg: err
      })
    )
  } else {
    Food.findOneAndUpdate({
      _id: id,
    }, {
      '$set': data,
    }).then(
      r => res.json({
        status: 1
      }),
      err => res.json({
        status: 0,
        msg: err
      })
    )
  }
}

function checkName(req, res, next) {
  const { name, id, store } = req.body;
  let query = {
    name,
    store,
  };
  if (id) {
    query._id = {'$ne': id};
  }
  Food.findOne(query).then(
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

function valid(req, res, next) {
  const id = req.params.id;
  Food.findById(id).then(
    r => {
      let v = r.valid === 1 ? 0 : 1;
      return Food.update({_id: id}, {
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

function recommend(req, res, next) {
  const id = req.params.id;
  Food.findById(id).then(
    r => {
      let v = !r.recommend;
      return Food.update({_id: id}, {
        $set: {
          recommend: v
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
  Food.findByIdAndRemove(id).then(
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
  form,
  save,
  checkName,
  listData,
  saveData,
  valid,
  recommend,
  del,
};