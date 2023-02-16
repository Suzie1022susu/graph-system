var fs = require('fs');
var express = require('express');

//创建路由对象
var router = express.Router();
var path = './public/data/';

/* GET home page. */
/* 当请求url为localhost:3000时渲染home.ejs返回给浏览器 */
//将请求挂在路由上
//--
router.get('/', function(req, res, next) {
  fs.readFile(path+'data.json', (err, data) => { // 读取文件，并执行回调函数
    if (err) {
      return res.send({
        status:0,
        info: 'fail.....'
      });
    }

    var obj = JSON.parse(data.toString());  // 返回数据
    return res.render('home', {  // 否则，如果读取成功，渲染模板edit.jsp，返回数据obj
      data: {
        arr: obj,
        name: req.cookies.username
      }
    });
  });
}); 

//
router.get('/login', function(req, res, next) {
  res.cookie('username', '');
  res.render('login', {});
});

//
router.get('/register', function(req, res, next) {
  res.render('register', {});
});


//--render 指去view中的哪个ejs
router.get('/send', function(req, res, next) {
  res.render('send', {
    data: {
      name: req.cookies.username
    }
  });
});

//暴露路由
module.exports = router;
