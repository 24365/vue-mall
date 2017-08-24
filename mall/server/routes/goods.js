const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');

// 连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall', {
  useMongoClient: true
});

mongoose.connection.on('connected',()=>{
  console.log("Mongodb connected success")
});
mongoose.connection.on('error',()=>{
  console.log("Mongodb connected fail")
});
mongoose.connection.on('disconnected',()=>{
  console.log("Mongodb connected disconnected")
});

//查询商品列表数据
router.get('/list',(req,res,next)=>{
  let sort = req.query["sort"];
  let page = req.query["page"];
  let pageSize = parseInt(req.query["pageSize"]);
  let skip = (page-1)*pageSize;
  let priceChecked = req.query["priceChecked"];
  let priceGt = '',priceLte = '';
  let params = {};
  if(priceChecked!=="all"){
    switch (priceChecked){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params = {
      salePrice: {
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec({},(err,doc)=>{
    if(err){
      res.json({
        status: '1',
        msg:err.message
      })
    }else {
      res.json({
        status: '0',
        msg: "",
        result: {
          count:doc.length,
          list: doc
        }
      })
    }
  })
});
// 加入到购物车
router.post("/addCart",(req,res,next)=>{
  let userId = '100000077',productId = req.body.productId;
  let User = require('../models/users');
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if(item.productId === productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId}, function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
});

module.exports = router;
