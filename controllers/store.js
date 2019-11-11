var Store = require('../models/Store');
var FoodMenu = require('../models/FoodMenu');
var Activity = require('../models/Activity');
var moment = require('moment');
// var async = require('async');

var util = require('../util');

function getStore(req, res) {
  let matchQuery = {};
  let { pageSize, pageIndex, services, costFrom, costTo } = req.query;
  pageSize = Number(pageSize);
  pageIndex = Number(pageIndex);
  pageSize = isNaN(pageSize) ? 10 : pageSize;
  pageIndex = isNaN(pageIndex) ? 1 : pageIndex;

  // 筛选条件
  // 商家服务 多选条件 【蜂鸟专送：1，品牌商家：2，新店：3，食安保：4，开发票：5】
  //discount 优惠活动【当前只考虑首单立减活动】
  if (services) {
    services = services.split(',');
    if (services.indexOf('1') >= 0) {
      matchQuery.isFNSpecialDelivery = true;
    }
    if (services.indexOf('2') >= 0) {
      matchQuery.isBrand = true;
    }
    if (services.indexOf('3') >= 0) {
      matchQuery.isNewStore = true;
    }
    if (services.indexOf('4') >= 0) {
      matchQuery.isFoodEnsure = true;
    }
    if (services.indexOf('5') >= 0) {
      matchQuery.invoice = true;
    }
  }

  
  try {
    costFrom = Number(costFrom);
    costFrom = isNaN(costFrom) ? 0 : costFrom;
    costTo = Number(costTo);
    costTo = isNaN(costTo) ? 0 : costTo;
    matchQuery.perSpend = {};
    if(costFrom) {
      matchQuery.perSpend['$gte'] = costFrom;
    }
    if(costTo) {
      matchQuery.perSpend['$lte'] = costTo;
    }
    if (!costTo && !costFrom) delete matchQuery.perSpend;
    console.log(matchQuery);
    Store.aggregate([{
        $match: matchQuery
      },
      {
        $lookup: {
          from: 'activities',  // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
          localField: '_id',  // 本地关联的字段
          foreignField: 'store', // user中用的关联字段
          as: 'activities' // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
        }
      }
    ]).skip(pageSize * (pageIndex - 1)).limit(pageSize).then(
      r => {
        console.log(r.length);
        res.json({
          status: 1,
          data: r,
        })
      },
      err => {
        res.json({
          status: 0,
          msg: err,
        })
      }
    );
  } catch (error) {
    console.log(error);
  }
  // Store.find().skip(pageSize * (pageIndex - 1)).limit(pageSize).then(
  //   r => {
  //     if (r && r.length) {
  //       r.forEach((item, i) => {
  //         r[i]._doc.activities = []
  //         Activity.find({store: item._id}).then(
  //           activities => {
  //             r[i]._doc.activities = activities;
  //             if (i === 0) {
  //               console.log(r[i]);
  //             }
  //           },
  //           err => {}
  //         )
  //       })
  //     }
      // res.json({
      //   status: 1,
      //   data: r,
      // })
  //   },
  //   err => {
  //     res.json({
  //       status: 0,
  //       msg: err,
  //     })
  //   }
  // )
}

function getStoreById(req, res) {
  const storeId = req.params.id;
  FoodMenu.findOne().then(
    r => {
      console.log(re);
      // 用默认id
      return FoodMenu.aggregate([
        { $match: {
          store: r.store
        }},
        {
          $lookup: {
            from: 'foods',  // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
            localField: '_id',  // 本地关联的字段
            foreignField: 'menus', // user中用的关联字段
            as: 'foods' // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
          }
        }
      ])
    },
    err => Promise.reject(err)
  ).then(
    r => {
      res.json({
      status: 1,
      data: r,
    })},
    err => res.json({
      status: 0,
      msg: err,
    })
  )
}

module.exports = {
  getStore,
  getStoreById,
};