var express = require('express');
var router = express.Router();
var Users = require('../models/Users');

/* GET users listing. */
router.post('/', function(req, res, next) {
  Users.create(req.body , (err, contect)=>{
    console.log(req.body);
  })
});

module.exports = router;
 