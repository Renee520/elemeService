var Store = require('../models/Store');
var Activity = require('../models/Activity');
var shopData = require('../data/shop');

function index (req, res) {
  res.render('create')
}

function remove(req, res) {
  let fns = [
    Store.remove(),
    Activity.remove(),
  ];

  Promise.all(fns).then(
    () => {
      res.render('create', {msg: '删除完成'})
    },
    err => {
      res.render('create', {error: err})
    }
  )
}

function createdShopData(req, res) {
  let fns = [];
  let afns = [];
  for(let i = 0; i < shopData.length; i ++) {
    const shop = shopData[i].restaurant;
    let data = {};
    data.name = shop.name + '_test';
    data.isSend = shop.float_delivery_fee ? true : false;
    data.sendBasePrice = shop.float_minimum_order_amount;
    data.sendPrice = shop.float_delivery_fee || 0;
    data.isBrand = Math.random() > 0.7 ? true : false;
    data.isNewStore = shop.is_new;
    data.isFoodEnsure = Math.random() > 0.7 ? true : false;
    data.isFNSpecialDelivery = shop.is_premium;
    data.invoice = Math.random() > 0.7 ? true : false;
    data.perSpend = Math.floor(Math.random() * (200 - 10)) + 10;
    data.selfTake = true;
    data.keyWord = [];
    data.isPerfect = Math.random() > 0.7 ? true : false;
    data.type = [];
    data.longitude = shop.latitude;
    data.latitude = shop.latitude;
    data.description = shop.description;
    data.promotionInfo = shop.promotion_info;
    data.address = '中国上海市徐汇区'

    // 标签
    shop.support_tags.forEach(item => {
      if (item && item.text !== '口碑人气好店') {
        data.keyWord.push(item.text);
      }
    })
    // 类型
    shop.flavors.forEach(item => {
      data.type.push(item.name);
    });

    var store = new Store(data);
    try {
      // 活动
      let activities = shop.activities;
      if (activities && activities.length) {
        let activity = {};
        activities.forEach(item => {
          activity.store = store._id;
          activity.name = item.name;
          activity.description = item.description;
          activity.iconSingleName = item.icon_name;
          activity.iconName = setIconName(item.icon_name);
          activity.iconSingleBg = item.icon_color;
          activity.exclusiveFood = item.is_exclusive_with_food_activity;
          
          // 规则
          if (activity.exclusiveFood) {
            activity.attribute = item.attribute;
            let attribute = JSON.parse(activity.attribute);
            if (typeof attribute !== 'number') {
              let a = {};
              for (let key in attribute) {
                a[key] = attribute[key]['1'];
              }
              activity.attribute = JSON.stringify(a);
            }
          }
          // 新用户
          activity.newUserOfSystem = /^新用户/.test(item.tips);
          activity.newUserOfStore = /^本店新用户/.test(item.tips);
          let activity1 = new Activity(activity);
          afns.push(activity1.save())
        })
      }
    
      fns.push(store.save());
      
    } catch (error) {
      console.log('=========', error);
    }
  }
  Promise.all(fns).then(
    () => {
      return Promise.all(fns);
    },
    err => Promise.reject(err)
  ).then(
    (r) => {
      console.log('门店创建成功');
      return Promise.all(afns)
    },
    err => Promise.reject(err)
  ).then(
    (r) => {
      console.log('活动创建成功');
    },
    err => {
      console.log('创建失败：', err);
    }
  ).finally(() => {
    res.render('create')
  })
}

function setIconName(name) {
  let text = name;
  switch(name) {
    case '减': text = '满减';
      break;
    case '首': text = '首单';
      break;
    case '折': text = '折扣';
      break;
    case '特': text = '特价';
      break;
    case '新': text = '新客';
      break;
    case '赠': text = '赠品';
      break;
    default: break;
  }
  return text;
}

module.exports = {
  createdShopData,
  index,
  remove,
};