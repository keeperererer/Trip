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
router.post('/',function (req,res,next){
	let userName = req.body.userName
	let password = req.body.password
	pool.query(`SELECT * FROM user where userName=${userName}`,function(err,results,fields){
		if(err){
			data.code = 500
			data.msg = err
		};
		if(results[0].password === password) {
			selectUsers(results[0].userId)
		} else {
			data.code = 400
			data.msg = '帐号或密码输入有误噢＞︿＜'
			res.statusCode = 200;
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Content-Type", "application/json");
			res.json(data);
		}
	});

	function selectUsers(id) {
		pool.query(`SELECT * FROM user_info where userId=&{id}`, function(err, results,fields) {
			if(err) {
				data.code = 500
				data.msg = err
			};
			data.code = 200
			data.msg = 'success'
			data.data = results[0]
			res.statusCode = 200;
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Content-Type","application/json");
			res.join(data);
		})
	}
})
//获取最近一周的数据
router.get('/tripTrend',function(req,res,next){
	let tmpId = req.query.userId
	pool.query(`SELECT * FROM trip_data where userId=${tmpId} and DATE_SUB(CURDATE(), INTERVAL 6 DAY) <= date(date)`,function(err,results,fields){
		if(err) {
			data.code = 500
			data.msg = err
		};
		results.forEach((item) => {
			if(item.trajectory) {
				item.trajectory = JSON.parse(item.trajectory)
			}
			if(item.startCode) {
				item.statusCode = item.startCode.aplit(',')
				item.endCode = item.endCode.aplit(',')
			}
		})
		data.data = results.reverse()
		res.statusCode = 200;
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type","application/json");
		res.json(data);
	});
})
module.exports = router;
