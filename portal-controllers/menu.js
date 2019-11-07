var util = require('../util');
var Store = require('../models/Store');
var FoodMenu = require('../models/FoodMenu');
var Food = require('../models/Food');

function index(req, res, next) {
  var storeId = req.params.storeId;
  console.log('==============', storeId);
  if (!storeId) {
    return res.render('error', { msg: '请选择门店' });
  }
  let store = {};
  Store.findById(storeId).then(
    r => {
      if (r) {
        store = r;
      }
      res.render('menu/menuList', { shop: store });
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

  let count = 0;
  FoodMenu.count().then(
    r => {
      count = r;
      return FoodMenu.find(searchKey).skip(Number(start)).limit(Number(length)).populate('store').sort(sort);
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
  if (!storeId) {
    return res.render('error', {msg: '请选择门店'})
  }
  Store.findById(storeId).then(
    r => {
      if (r) {
        shop = r;
        if (id) {
          return FoodMenu.findById(id);
        }
        return Promise.resolve(new FoodMenu());
      }
    },
    err => Promise.reject(err)
  ).then(
    menu => {
      res.render('menu/menuForm', {shopStr: JSON.stringify(shop), shop, menu});
    },
    err => res.render('error', {msg: err})
  )
};
function save(req, res, next) {
  const { name, id } = req.body;
  if (!req.body.shop) {
    return res.json({
      status: 0,
      msg: '请选择商店',
    })
  }
  let data = req.body;
  data.store = data.shop;
  data.valid = util.checkboxValue(data.valid, 'number');
  if (!id) {
    const menu = new FoodMenu(data);
    menu.save().then(
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
    FoodMenu.findOneAndUpdate({
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
  const { name, id, shop } = req.body;
  let query = {
    name,
    store: shop,
  };
  if (id) {
    query._id = {'$ne': id};
  }
  console.log(query);
  FoodMenu.findOne(query).then(
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
  FoodMenu.findById(id).then(
    r => {
      let v = r.valid === 1 ? 0 : 1;
      return FoodMenu.update({_id: id}, {
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

function getFoodByMenu(req, res, next) {
  let menuId = req.params.menuId;
  if (!menuId) {
    return res.json({
      status: 0,
      msg: '请选择菜单',
    })
  }
  Food.find({
    menu: menuId
  }).then(
    r => {
      res.json({
        status: 1,
        data: r
      })
    },
    err => {
      res.json({
        status: 0,
        msg: err
      })
    }
  )

}

function del(req, res, next) {
  const id = req.params.id;
  FoodMenu.findByIdAndRemove(id).then(
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
  getFoodByMenu,
  del,
};