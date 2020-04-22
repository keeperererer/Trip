var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const jwt = require('jsonwebtoken')
const config = require('../config')
var data = {
  code: 200,
  msg: 'success',
} //最后返回的json对象

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'trip',
  timezone: '08:00',
})

router.post('/', function (req, res, next) {
  let name = req.body.name
  let userName = req.body.userName
  let passWord = req.body.passWord
  let avatar =
    'data:image/jpeg;base64,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'

  pool.query(`SELECT * FROM user_info WHERE userName=${userName}`, function (
    err,
    results,
    fields
  ) {
    console.log(results)
    // if (err) {
    //   data.code = 500
    //   data.msg = err
    // }
    if (results && results.length) {
      if (results[0].passWord === passWord) {
        const token = jwt.sign(
          {
            id: results[0].userId,
            userName: results[0].userName,
          },
          config.jwtSecret
        )
        data.code = 200
        data.msg = 'sucess'
        data.data = results[0]
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'application/json')
        data.token = token
        res.json(data)
      } else {
        data.code = 400
        data.msg = '账号或密码输入有误'
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'application/json')
        res.json(data)
      }
    } else {
      pool.query(
        `INSERT INTO user_info (name,userName,passWord,avatar) VALUES ('${name}','${userName}','${passWord}','${avatar}')`,
        function (err, results, fields) {
          if (err) {
            data.code = 400
            data.msg = err
          }
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Content-Type', 'application/json')
          res.json(data)
        }
      )
    }
  })
})
router.post('/upAvatar', function (req, res, next) {
  let userId = parseInt(req.body.userId)
  let avatar = req.body.avatar
  pool.query(
    `UPDATE user_info SET avatar='${avatar}' WHERE userId=${userId}`,
    function (err, results, fields) {
      if (err) {
        data.code = 400
        data.msg = err
      }
      console.log(results)
      if (results && results.affectedRows) {
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'application/json')
        res.json('success')
      } else {
        res.json('上传失败')
      }
    }
  )
})
router.get('/getAvatar', function (req, res, next) {
  let userId = req.query.userId
  pool.query(`SELECT avatar FROM user_info WHERE userId = ${userId}`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 400
      data.msg = err
    }
    data.data = results
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})

// 获取最近一周
router.get('/tripTrend', function (req, res, next) {
  let tmpId = req.query.userId
  //增删改查之后查询，并把查询的最终数据返回前端
  pool.query(
    `SELECT * FROM trip_data where userId=${tmpId} and DATE_SUB(CURDATE(), INTERVAL 6 DAY) <= date(date)`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      // 更改经纬度坐标数据类型
      results.forEach((item) => {
        if (item.trajectory) {
          item.trajectory = JSON.parse(item.trajectory)
        }
        if (item.startCode) {
          item.startCode = item.startCode.split(',')
          item.endCode = item.endCode.split(',')
        }
      })
      data.data = results.reverse()
      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})

router.get('/price', function (req, res, next) {
  let tmpId = req.query.userId
  pool.query(
    `SELECT tripType,price FROM trip_data WHERE userId=${tmpId} and type='traffic'`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      data.data = results
      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
module.exports = router
