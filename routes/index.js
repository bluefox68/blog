var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/reg', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/reg', function(req, res, next) {
  
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login', function(req, res, next) {
  
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});
router.post('/post', function(req, res, next) {
  
});

router.get('/loginout', function(req, res, next) {
  
});

module.exports = router;
