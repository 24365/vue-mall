const express = require('express');
const router = express.Router();
const User = require('./../models/users');
require('./../util/util');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登入
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // req.session.user = doc;
        res.json({
          status: "0",
          msg: "",
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: "1",
          msg: "账号密码不对",
          result: ""
        })
      }
    }
  })
});
// 登出
router.post('/logout', (req, res, next) => {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.cookie("userName", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: "0",
    msg: "",
    result: ""
  })
});
// 校验登入状态
router.get("/checkLogin", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: "0",
      msg: "",
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: "1",
      msg: "当前未登录",
      result: ""
    })
  }
});
// 查询当前购物车列表
router.get("/cartList", (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.cartList
        })
      } else {
        res.json({
          status: "1",
          msg: "当前用户不存在",
          result: ""
        })
      }
    }
  })
});
// 购物车删除商品
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId;
  User.update({userId: userId}, {$pull: {'cartList': {'productId': productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: "suc"
      })
    }
  })
});
// 增减商品数量
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId, productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({"userId": userId, "cartList.productId": productId}, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: "suc"
      })
    }
  })
});
// 全选取消
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId, checkAll = req.body.checkAll;
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll
        });
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
              result: ""
            })
          } else {
            res.json({
              status: "0",
              msg: '',
              result: "suc"
            })
          }
        })
      } else {
        res.json({
          status: "1",
          msg: "用户不存在",
          result: ""
        })
      }
    }
  })
});
// 查询用户地址
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.addressList
        })
      }
    }
  })
});
// 设置默认用户地址
router.post("/setDefault", (req, res, next) => {
  let userId = req.cookies.userId, addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: "1001",
      msg: "addressId is null",
      result: ""
    })
  }
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        let addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId === addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        });
        doc.save((err1, doc1) => {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
              result: ""
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: ""
            })
          }
        })
      }
    }
  })
});
// 删除用户地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({userId: userId}, {$pull: {addressList: {addressId: addressId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: "0",
        msg: "",
        result: ""
      })
    }
  })
});
// 创建订单
router.post("/payMent",(req,res,next)=>{
  let userId = req.cookies.userId, addressId = req.body.addressId, orderTotal = req.body.orderTotal;
  User.findOne({userId:userId},(err,doc)=>{
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if(doc){
        let address = '',goodsList=[];
        doc.addressList.forEach(item=>{
          if(item.addressId===addressId){
            address = item
          }
        });
        doc.cartList.filter(item=>{
          if(item.checked==="1"){
            goodsList.push(item)
          }
        });
        let platform = '622';
        let r1 = Math.floor(Math.random()*10);
        let r2 = Math.floor(Math.random()*10);
        let sysDate = new Date().Format('yyyyMMddhhmmss');
        let orderDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        let orderId = platform+r1+sysDate+r2;

        let order={
          orderId:orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList:goodsList,
          orderStatus: '1',
          createDate: orderDate
        };
        doc.orderList.push(order);
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status: "0",
              msg: err1.message,
              result: ""
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: {
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            })
          }
        })
      }
    }
  })
});
// 订单查询
router.get('/orderDetail',(req,res,next)=>{
  let userId = req.cookies.userId, orderId = req.query.orderId;
  User.findOne({userId:userId}, function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      let orderList = userInfo.orderList;
      if(orderList.length>0){
        let orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId === orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          });
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        });
      }
    }
  })
});
// 查询商品数量
router.get('/cartCount',(req,res,next)=>{
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      } else {
        let cartList = doc.cartList;
        let countNum = 0;
        cartList.map(item=>{
          countNum += parseInt(item.productNum)
        });
        res.json({
          status:'0',
          msg:"",
          result: countNum
        });
      }
    });
  }
});
module.exports = router;
