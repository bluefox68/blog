
function LoginOut(){}

LoginOut.prototype.get =  function(req, res, next) {
	req.session.user = null;
	req.flash("success","退出成功");
	res.redirect("/");
}

module.exports = LoginOut;