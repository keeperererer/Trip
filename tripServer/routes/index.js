var express = require('express')
var router = express.Router()
var mysql = require('mysql')

var data = {
  code: 200,
  msg: 'success',
}
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'trip',
  timezone: '08:00',
})
// router.get('/userId', function (req, res, next) {
//   let tmpName = req.body.userName
//   pool.query(`SELECT userId FROM user where userName=${tmpName}`,function(err,results,fields){
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader('Content-Type', 'application/json');
//     res.json(results)
//   })
// })

// router.get('/', function (req, res, next) {
//   res.send('hello world')
// })
module.exports = router
