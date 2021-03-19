var express = require('express');
var router = express.Router();
var Users= require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/new' , (req, res, next)=>{
  var error = req.flash('error')
  res.render('newuser',{error:error});
})


router.get('/login' ,(req, res, next)=>{
  var error = req.flash('error')
  res.render('login', {error});
})

router.post('/', (req, res, next)=>{
  if(req.password.length < 4) {
    req.flash('error' , 'please enter more then 4 charenter')
    res.redirect('/users/new');
  }
  Users.create(req.body, (err, content)=>{
    if(err) return next(err)
    res.redirect('login')
  })
})


router.post('/login', (req, res, next)=>{
  var {email ,password} = req.body
  if(!email || !password) {
    req.flash('error' , 'please enter the email and password')
    return res.redirect('/users/login');
  }
  Users.findOne({email}, (err, user)=> {
    if(err) return next(err)
    if(!user) {
      req.flash('error' , 'email is not rasister')
      return res.redirect('/users/login')
    }
    user.verifyPassword(password , (err , result)=>{
      if(err) return next(err)
      if(!result) {
        req.flash('error' , 'invaild paswword')
        return res.redirect('/users/login')
      }

      //persist logged in user information
      req.session.usersId = user.id
      res.redirect('/users')
    })
  })
})



module.exports = router;
