var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('name' , 'ravindra').render('index', { title: 'Cookei set' });
});

module.exports = router;
