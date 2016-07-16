var crypto = require('crypto');
var	User = require("../models/user");

function Links(){}

Links.prototype.get = function(req, res, next) {
  res.render('links', { 
  	title: '友情链接',
  	user:req.session.user,
  	error:req.flash("error").toString() 
  });
}

module.exports = Links;