// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

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
// router.get('/',function(req,res,next){
// 	pool.query(`SELECT * FROM user`,function(err,result){
// 		// resolve();
// 		res.send(result)
// 	})
// })

// router.get('/all',function(req,res,next){
// 	let userId = req.body.userId
// 	pool.query(`SELECT * FROM user_info where userId=${userId}`,function(err,result){
// 		// resolve();
// 		res.send(result)
// 	})
// })

// router.get('/historyList',function(req,res,next){
// 	let tmpId = req.query.userId
// 	pool.query(`SELECT * FROM trip_data where userId=${tmpId}`,function(err,results,fields){
// 		// if(err){
// 		// 	data.code = 500
// 		// 	data.msg = err
// 		// };
// 		// results.forEach((item) => {
// 		// 	if(item.trajectory) {
// 		// 		item.trajectory = JSON.parse(item.trajectory)
// 		// 	}
// 		// 	if(item.startCode) {
// 		// 		item.startCode = item.startCode.split(',')
// 		// 		item.endCode = item.endCode.split(',')
// 		// 	}
// 		// })
// 		// data.data = results.reverse()
// 		// res.statusCode = 200;
// 		// res.setHeader("Access-Control-Allow-Origin","*");
// 		// res.setHeader("Content-Type", "application/json");
// 		// res.join(data);
// 		res.send(data)
// 	});
// })
module.exports = router;