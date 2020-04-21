var express = require('express')
var router = express.Router()
var mysql = require('mysql')

var data = {
  code: 0,
  msg: '',
  count: 0,
} //最后返回的json对象

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'trip',
  timezone: '08:00',
})
router.get('/regNum', function (req, res, next) {
  pool.query(`SELECT * FROM user`, function (err, results, fields) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    data.count = data.data.length
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.get('/personNum', function (req, res, next) {
  pool.query(`SELECT * FROM trip_data WHERE type='trip'`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.get('/trafficNum', function (req, res, next) {
  pool.query(`SELECT * FROM trip_data WHERE type='traffic'`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.get('/allNum', function (req, res, next) {
  pool.query(`SELECT * FROM total_data`, function (err, results, fields) {
    let sum = 0
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    sum = data.data
    res.json(sum)
  })
})
router.get('/price', function (req, res, next) {
  pool.query(
    `SELECT tripType,price FROM trip_data WHERE type='traffic'`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      data.data = results
      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data.data)
    }
  )
})
router.get('/userInfo', function (req, res, next) {
  pool.query(`SELECT * FROM user_info`, function (err, results, fields) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    data.count = data.data.length
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/updateUserInfo', function (req, res, next) {
  let name = req.body.name,
    userName = req.body.userName,
    userId = req.body.userId
  // res.json(name)
  pool.query(
    `UPDATE user_info SET name="${name}",userName="${userName}" WHERE userId="${userId}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.post('/deleteUserInfo', function (req, res, next) {
  let userId = req.body.userId
  pool.query(`DELETE FROM user_info WHERE userId="${userId}"`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    res.statusCode = 200
    data.code = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/addUserInfo', function (req, res, next) {
  let name = req.body.name,
    userName = req.body.userName,
    userId = req.body.userId
  // res.json(name)
  pool.query(
    `INSERT INTO user_info SET name="${name}",userId="${userId}",userName="${userName}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.get('/totalData', function (req, res, next) {
  pool.query(`SELECT * FROM total_data`, function (err, results, fields) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    data.count = data.data.length
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/updateTotalData', function (req, res, next) {
  let userId = req.body.userId,
    allWalk = req.body.allWalk,
    allRun = req.body.allRun,
    allCycle = req.body.allCycle,
    allDrive = req.body.allDrive,
    allBus = req.body.allBus,
    allTaxi = req.body.allTaxi
  // res.json(name)
  pool.query(
    `UPDATE total_data SET allWalk="${allWalk}",allRun="${allRun}",allCycle="${allCycle}",allDrive="${allDrive}",allBus="${allBus}",allTaxi="${allTaxi}" WHERE userId="${userId}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.post('/deleteTotalData', function (req, res, next) {
  let userId = req.body.userId
  pool.query(`DELETE FROM total_data WHERE userId="${userId}"`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    res.statusCode = 200
    data.code = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/addTotalData', function (req, res, next) {
  let userId = req.body.userId,
    allWalk = req.body.allWalk,
    allRun = req.body.allRun,
    allCycle = req.body.allCycle,
    allDrive = req.body.allDrive,
    allBus = req.body.allBus,
    allTaxi = req.body.allTaxi
  // res.json(name)
  pool.query(
    `INSERT INTO total_data SET userId="${userId}",allWalk="${allWalk}",allRun="${allRun}",allCycle="${allCycle}",allDrive="${allDrive}",allBus="${allBus}",allTaxi="${allTaxi}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.get('/user', function (req, res, next) {
  pool.query(`SELECT * FROM user`, function (err, results, fields) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    data.count = data.data.length
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/updateUser', function (req, res, next) {
  let passWord = req.body.passWord,
    userName = req.body.userName,
    userId = req.body.userId
  // res.json(name)
  pool.query(
    `UPDATE user SET userName="${userName}",passWord="${passWord}" WHERE userId="${userId}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.post('/deleteUser', function (req, res, next) {
  let userId = req.body.userId
  pool.query(`DELETE FROM user WHERE userId="${userId}"`, function (
    err,
    results,
    fields
  ) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    res.statusCode = 200
    data.code = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
router.post('/addUser', function (req, res, next) {
  let passWord = req.body.passWord,
    userName = req.body.userName,
    userId = req.body.userId
  // res.json(name)
  pool.query(
    `INSERT INTO user SET userId="${userId}",userName="${userName}",passWord="${passWord}"`,
    function (err, results, fields) {
      if (err) {
        data.code = 500
        data.msg = err
      }
      res.statusCode = 200
      data.code = 400
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      res.json(data)
    }
  )
})
router.get('/tripData', function (req, res, next) {
  pool.query(`SELECT * FROM trip_data`, function (err, results, fields) {
    if (err) {
      data.code = 500
      data.msg = err
    }
    data.data = results
    res.statusCode = 200
    data.count = data.data.length
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  })
})
module.exports = router
