var Post = require("../models/post");

function Publish(){}
Publish.prototype.get = function(req, res, next) {
  res.render('post', { 
  	title: '发表',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
}

Publish.prototype.post = function(req, res, next) {
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
}

module.exports = Publish;