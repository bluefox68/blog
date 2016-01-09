var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var	User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{
  	title: '主页',
  	user:req.session.user,
  	success:req.flash("success").toString(),
  	error:req.flash("error").toString()
  });
});

router.get('/reg', function(req, res, next) {
  res.render('register',{ 
  	title: '注册'
  });
});

router.post('/reg', function(req, res, next) {
  var name  = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];

	if(password_re != password){
		req.flash("error","两次输入的密码不一致!");
		return res.redirect("./reg");
	}

	var md5 = crypto.createHash("md5"),
			password = md5.update(req.body.password).digest('hex');

	var newUser = new User({
		name : req.body.name,
		password : req.body.password,
		email : req.body.email
	});

	User.get(newUser.name,function(err,user){
		if (err) {
			req.flash("error",err);
			return res.redirect("/");
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
			req.flash("success","注册成功");
			res.redirect("/");
		});
	});
});


router.get('/login', function(req, res, next) {
  res.render('login', { 
  	title: 'Express',
  	user:req.session.user,
  	success:req.flash("success").toString(),
  	error:req.flash("error").toString() 
  });
});
router.post('/login', function(req, res, next) {
  
});

router.get('/post', function(req, res, next) {
  res.render('post', { 
  	title: 'Express11',
  	user:req.session.user
  });
});
router.post('/post', function(req, res, next) {
	
});

router.get('/loginout', function(req, res, next) {
  res.redirect("/");
});

module.exports = router;
