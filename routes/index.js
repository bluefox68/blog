var express = require('express');
var router = express.Router();

var Home = require("./home");
var Login = require("./login");
var LoginOut = require("./loginout");
var Register = require("./register");
var Upload = require("./upload");
var Post = require("./post");
var Links = require("./links");
var Article = require("./article");

var checkLogin = function(req,res,next){//对于需要登录查看的页面需要检查是否登录
	if(!req.session.user){
		req.flash('error',"未登录！");
		res.redirect("/login");
	}
	next();
}

var checkNotLogin = function(req,res,next){//对于不需要登录的页面需要检查是否不登录
	if(req.session.user){
		req.flash('error',"已登录！");
		res.redirect("back");
	}
	next();
}

var home = new Home()
router.get('/',home.get);

//登录
var login = new Login();
router.get('/login',checkNotLogin);
router.get('/login',login.get);
router.post('/login',login.post);

//退出
var loginOut = new LoginOut();
router.get('/loginout',checkLogin);
router.get('/loginout',loginOut.get);

//注册
var register = new Register();
router.get('/reg',checkNotLogin);
router.get('/reg',register.get);
router.post('/reg',register.post);

//文章发布
var post = new Post();
router.get('/post',checkLogin);
router.get('/post',post.get);
router.post('/post',post.post);

//文件上传
var upload = new Upload();
router.get('/upload',checkLogin);
router.get('/upload',upload.get);
router.post('/upload',checkLogin);
router.post('/upload',upload.post);

//用户评论和留言
var article = new Article()
router.get('/u/:name',article.getDefault);
router.get('/u/:name/:day/:title',article.get);
router.post('/u/:name/:day/:title',article.post);


var links = new Links();
router.get('/links',links.get);

module.exports = router;
