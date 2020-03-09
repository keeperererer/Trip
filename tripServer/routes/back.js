var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var data = {
  code: 0,
  msg: '',
  count: 0
}; //最后返回的json对象

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'trip'
});
router.get('/regNum',function(req,res,next) {
  pool.query(`SELECT * FROM user`,function(err,results,fields) {
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    data.count = data.data.length;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(data)
  })
})
router.get('/personNum',function(req,res,next) {
  pool.query(`SELECT * FROM trip_data WHERE type='trip'`,function(err,results,fields) {
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  })
})
router.get('/trafficNum',function(req,res,next) {
  pool.query(`SELECT * FROM trip_data WHERE type='traffic'`,function(err,results,fields) {
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  })
})
router.get('/allNum',function(req,res,next) {
  pool.query(`SELECT * FROM total_data`,function(err,results,fields) {
    let sum = 0;
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    sum = data.data
    res.json(sum)
  })
})
router.get('/price',function(req,res,next) {
  pool.query(`SELECT tripType,price FROM trip_data WHERE type='traffic'`,function (err,results,fields) {
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(data.data);
  })
})
router.get('/userInfo',function(req,res,next) {
  pool.query(`SELECT * FROM user_info`,function(err,results,fields) {
    if(err) {
      data.code = 500
      data.msg = err
    };
    data.data = results
    res.statusCode = 200;
    data.count = data.data.length;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(data)
  })
})
module.exports = router;