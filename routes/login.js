var crypto = require('crypto');
var	User = require("../models/user");

function Login(){}

Login.prototype.get = function(req, res, next) {
  res.render('login', { 
  	title: '登录',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
}

Login.prototype.post = function(req, res, next) {
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
}

module.exports = Login;