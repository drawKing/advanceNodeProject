const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest: './static/upload'});
const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');

var server=express();
server.listen(8080);

//1.获取请求数据

server.use(bodyParser.urlencoded())
server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();

//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//4.route
// server.use('/article/', require('./route/1.js')());
// server.use('/blog/', require('./route/2.js')());
server.use('/', require('./route/web/index.js')());
server.use('/admin/', require('./route/admin/index.js')());

//5.default：static
server.use(static('./static/'));
