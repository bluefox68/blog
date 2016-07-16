var crypto = require('crypto');
var	User = require("../models/user");

function Register(){}

Register.prototype.get =  function(req, res, next) {
  res.render('register',{ 
  	title: '注册',
  	user:req.session.user,
  	error:req.flash("error").toString()
  });
}

Register.prototype.post = function(req, res, next) {
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
}

module.exports = Register;