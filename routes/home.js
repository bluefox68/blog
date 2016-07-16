var Post = require("../models/post");

function Home(){}

Home.prototype.get = function(req, res, next) {
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
}

module.exports = Home;

