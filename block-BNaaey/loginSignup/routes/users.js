var express = require('express');
var router = express.Router();
var Users = require('../models/Users');

/* GET users listing. */

 router.get('/' , (req, res, next)=> {
   console.log(req.body);
   res.render('loginSuccess')
 })


router.get('/new', function(req, res, next) {
  res.render('users.ejs');
});

router.get('/login' , (req,res, next)=> {
  res.render('login')
})

router.post('/' , (req, res, next)=> {
  Users.create(req.body , (err , content)=> {
    if(err) return next(err);
    res.redirect('/users/login');
  })
})


router.post('/login' , (req, res, next)=> {
  var {email ,password} = req.body
  if(!email || !password) {
    return res.redirect('/users/login');
  }
  Users.findOne({email}, (err, user)=> {
    if(err) return next(err)
    if(!user) {
      return res.redirect('/users/login')
    }
    user.verifyPassword(password , (err , result)=>{
      if(err) return next(err)
      if(!result) {
        return res.redirect('/users/login')
      }

      //persist logged in user information
      req.session.usersId = user.id
      res.redirect('/users')
    })
  })
})

module.exports = router;
