var mongodb = require("./db");
var markdown = require("markdown").markdown;

function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.post = post;
}

Post.prototype.save = function(callback){
	var date = new Date();
	var time = {
		date : date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
	var post = {
		name : this.name,
		time : time,
		title : this.title,
		post : this.post,
		pv : 0,
		comments : []
	};

	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection("posts",function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
			
			collection.insert(post,{
				safe : true
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				};
				callback(null);
			});
		});
	});
}

Post.getAll = function(name,callback){
	mongodb.open(function(err,db){
		if (err){
			return callback(err);
		};
		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
			var query = {};
			if (name) {
				query.name = name;
			};
			collection.find(query).sort({
				time : -1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);
				};
				docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post);
				});
				callback(null,docs);
			});
		});
	});
}

Post.getOne = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection("posts",function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
			collection.findOne({
				"name" : name,
				"time.day" : day,
				"title" : title
			},function(err,doc){
				if (err) {
					mongodb.close();
					return callback(err);
				};
				if (doc) {
					collection.update({
						"name" : name,
						"time.day" : day,
						"title" : title
					},{
						$inc : {"pv" : 1}
					},function(err){
						mongodb.close();
						if (err) {
							return callback(err);
						};
					});
					
					doc.post = markdown.toHTML(doc.post);
					doc.comments.forEach(function(comment){
						comment.content = markdown.toHTML(comment.content);
					});
					callback(null,doc);
				};
			})
		});
	});
}

Post.getTen = function(name,page,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
			var query = {};
			if (name) {
				query.name = name;
			};
			collection.count(query,function(err,total){
				collection.find(query,{
					skip:(page - 1)*10,
					limit : 10
				}).sort({
					time : -1
				}).toArray(function(err,docs){
					mongodb.close();
					if (err) {
						return callback(err);
					};
					docs.forEach(function(doc){
						doc.post = markdown.toHTML(doc.post);
					});
					callback(null,docs,total);
				})
			});
		});
	});
}

module.exports = Post;