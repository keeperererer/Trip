var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var data = {
	code: 200,
	msg: 'success'
};
var allDistanceData = {
	allBus: 0,
	allCycle: 0,
	allDrive: 0,
	allRun: 0,
	allTaxi: 0,
	allWalk:0
}
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 3306,
	database: 'mytrip'
});
router.get('/historyList',function(req,res,next){
	let tmpId = req.query.userId
	pool.query(`SELECT * FROM trip_data where userId=${tmpId}`,function(err,results,fields){
		if(err){
			data.code = 500
			data.msg = err
		};
		results.forEach((item) => {
			if(item.trajectory) {
				item.trajectory = JSON.parse(item.trajectory)
			}
			if(item.startCode) {
				item.startCode = item.startCode.split(',')
				item.endCode = item.endCode.split(',')
			}
		})
		data.data = results.reverse()
		res.statusCode = 200;
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type", "application/json");
		res.join(data);
	});
})

router.get('/addTrip', function(req,res,next){
	let query = req.query
	if(query.tripType === '徒步出行') {
		allDistanceData.allWalk = (Number(allDistanceData.allWalk) + Number(query.distance)).toFixed(2)
		allDistanceUpdate('allWalk',allDistanceData.allWalk,query.userId)
	} else if (query.tripType === '跑步出行') {
		allDistanceData.allRun = (Number(allDistanceData.allRun) + Number(query.distance)).toFixed(2)
		allDistanceUpdate('allRun',allDistanceData.allRun,query.userId)
	} else if (query.tripType === '骑行出行') {
		allDistanceData.allCycle = (Number(allDistanceData.allCycle) + Number(query.distance)).toFixed(2)
		allDistanceUpdate('allCycle',allDistanceData.allCycle.query.userId)
	} else if (query.tripType === '自驾出行') {
		allDistanceData.allDrive = (Number(allDistanceData.allDrive) + Number(query.distance)).toFixed(2)
		allDistanceUpdate('allDrive',allDistanceData.allDrive,query.userId)
	}
    pool.query(`INSERT INTO trip_data ( userId, type,tripType,distance,date,time,trajectory,Calorie,speed,mark) VALUES ('${query.userId}','${query.type}','${query.tripType}','${query.distance}','${query.date}','${query.time}','${query.trajectory}','${query.Calorie}','${query.speed}','${query.mark}')`, function (err, results, fields) {
        if (err) {
            data.code = 500
            data.msg = err
        } else {
            data.msg = '成功'
            data.code = 200
        }
        // 更改经纬度坐标数据类型
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
})

router.get('/addTraffic', function (req, res, next) {
    let query = req.query
    if (query.tripType === '步行') {
        allDistanceData.allWalk = (Number(allDistanceData.allWalk)+Number(query.distance)).toFixed(2)
        allDistanceUpdate('allWalk',allDistanceData.allWalk,query.userId)
    } else if (query.tripType === '出租车') {
        allDistanceData.allTaxi = (Number(allDistanceData.allTaxi)+Number(query.distance)).toFixed(2)
        allDistanceUpdate('allTaxi',allDistanceData.allTaxi,query.userId)
    } else if (query.tripType === '单车/电车') {
        allDistanceData.allCycle = (Number(allDistanceData.allCycle)+Number(query.distance)).toFixed(2)
        allDistanceUpdate('allCycle',allDistanceData.allCycle,query.userId)
    } else if (query.tripType === '公交/地铁') {
        allDistanceData.allBus = (Number(allDistanceData.allBus)+Number(query.distance)).toFixed(2)
        allDistanceUpdate('allBus',allDistanceData.allBus,query.userId)
    }
    //增删改查之后查询，并把查询的最终数据返回前端
    pool.query(`INSERT INTO trip_data ( userId, type, tripType, distance, date, time, price, startPlace, endPlace, startCode, endCode, mark) VALUES ('${query.userId}','${query.type}','${query.tripType}','${query.distance}','${query.date}','${query.time}','${query.price}','${query.startPlace}','${query.endPlace}','${query.startCode}','${query.endCode}','${query.mark}')`, function (err, results, fields) {
        if (err) {
            data.code = 500
            data.msg = err
        } else {
            data.msg = '成功'
            data.code = 200
        }
        // 更改经纬度坐标数据类型
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
})

function allDistanceUpdate(key, value, userId){
	console.log(`${key}出行里程更新`)
	console.log(allDistanceData)
	data.data = allDistanceData
	pool.query(`UPDATE total_data SET ${key}=${value} where userId=${userId}`, function(err, results, fields) {
	})
}
module.exports = router;