var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var	User = require("../models/user");
var Post = require("../models/post");
var Comment = require("../models/comment");

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


router.get('/', function(req, res, next) {
	var page = req.query.p ? parseInt(req.query.p) : 1;
	Post.getTen(null,page,function(err,posts,total){
		if (err) {
			posts = [];
		};

		res.render('index',{
	  	title : '首页',
	  	user : req.session.user,
	  	posts : posts,
	  	page : page,
	  	isFirstPage : (page -1) == 0,
	  	isLastPage : ((page -1)*10 + posts.length) == total,
	  	success : req.flash("success").toString(),
	  	error : req.flash("error").toString()
	  });
	});
});

router.get('/reg',checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('register',{ 
  	title: '注册',
  	user:req.session.user,
  	error:req.flash("error").toString()
  });
});


router.post('/reg', function(req, res, next) {
  var name  = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];

	if(password_re != password){
		req.flash("error","两次输入的密码不一致!");
		return res.redirect("/reg");
	}

	var md5 = crypto.createHash("md5"),
			password = md5.update(req.body.password).digest('hex');

	var newUser = new User({
		name : req.body.name,
		password : password,
		email : req.body.email
	});

	User.get(newUser.name,function(err,user){
		if (err) {
			req.flash("error",err);
			return res.redirect("/reg");
		};
		if(user) {
			req.flash("error","用户名已经存在！");
			return res.redirect("/reg");
		};
		newUser.save(function(err,user){
			if (err) {
				req.flash("error",err);
				return res.redirect("/reg");
			};
		
			req.session.user = user;

			console.log("user:"+JSON.stringify(user));
			req.flash("success","注册成功");
			res.redirect("/");
		});
	});
});

router.get('/login',checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', { 
  	title: '登录',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
});

router.post('/login', function(req, res, next) {
  var md5 = crypto.createHash("md5"),
			password = md5.update(req.body.password).digest('hex');

	User.get(req.body.name,function(err,user){

		if (!user) {
			req.flash("error","用户不存在！");
			return res.redirect("/login");
		};

		if(user.password != password){
			req.flash("error","密码错误!");
			return res.redirect("./login");
		}

		req.session.user = user;
		req.flash("success","登录成功");
		res.redirect("/");
	});

});

router.get('/post',checkLogin);
router.get('/post', function(req, res, next) {
  res.render('post', { 
  	title: '发表',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
});
router.post('/post', function(req, res, next) {
	var currentUser = req.session.user.ops[0],
			post = new Post(currentUser.name,req.body.title,req.body.post);

	post.save(function(err){
		if (err) {
			req.flash('error',err);
			return res.redirect("/");
		};
		req.flash("success","发布成功");
		res.redirect("/");
	});
});

router.get('/loginout',checkLogin);
router.get('/loginout', function(req, res, next) {
	req.session.user = null;
	req.flash("success","退出成功");
	res.redirect("/");
});

router.get('/upload',checkLogin);
router.get('/upload', function(req, res, next) {
	res.render('upload', { 
  	title: '文件上传',
  	user:req.session.user,
  	success:req.flash("success").toString(),
  	error:req.flash("error").toString() 
  });
});

router.post('/upload',checkLogin);
router.post('/upload', function(req, res, next) {
	req.flash("success","文件上传成功");
	res.redirect("./upload");
});

router.get('/u/:name', function(req, res, next) {
	var page = req.query.p ? parseInt(req.query.p) : 1;
	
	User.get(req.params.name,function(err,user){
		if (!user) {
			req.flash('error','用户不存在');
			return res.redirect("/");
		};
		Post.getTen(null,page,function(err,posts,total){
			if (err) {
				posts = [];
			};

			res.render('index',{
		  	title : '首页',
		  	user : req.session.user,
		  	posts : posts,
		  	page : page,
		  	isFirstPage : (page -1) == 0,
		  	isLastPage : ((page -1)*10 + posts.length) == total,
		  	success : req.flash("success").toString(),
		  	error : req.flash("error").toString()
		  });
		});
	});
});
router.get('/u/:name/:day/:title', function(req, res, next) {
	Post.getOne(req.params.name,req.params.day,req.params.title,function(err,post){
		if (err) {
			req.flash("error",err);
			return res.redirect("/");
		};
		res.render("article",{
			title : req.params.title,
			post : post,
			user : req.session.user,
			success : req.flash("success").toString(),
			error : req.flash("error").toString()
		});
	});
});
router.post('/u/:name/:day/:title', function(req, res, next) {
	var date = new Date(),
	 		time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	
	var comment = {
		name : req.body.name,
		email : req.body.email,
		website : req.body.website,
		time : time,
		content : req.body.content
	};
	var newComment = new Comment(req.params.name,req.params.day,req.params.title,comment);
	newComment.save(function(err){
		if (err) {
			req.flash("error",err);
			return res.redirect("back");
		};
		req.flash("sucess","留言成功！");
		res.redirect("back");
	});
});


router.get('/links', function(req, res, next) {
  res.render('links', { 
  	title: '友情链接',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
});

module.exports = router;
