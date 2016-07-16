var	User = require("../models/user");
var Comment = require("../models/comment");

function Article(){}

Article.prototype.getDefault = function(req, res, next) {
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
}
Article.prototype.get = function(req, res, next) {
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
}

Article.prototype.post = function(req, res, next) {
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
}

module.exports = Article;
