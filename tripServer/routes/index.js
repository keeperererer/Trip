var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var data = {
    code: 200,
    msg: 'success'
}; 
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'trip'
});
router.get('/userId', function (req, res, next) {
  let tmpName = req.query.userName
  pool.query(`SELECT userId FROM user where userName=${tmpName}`,function(err,results,fields){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.json(results)
  })
})
module.exports = router;
