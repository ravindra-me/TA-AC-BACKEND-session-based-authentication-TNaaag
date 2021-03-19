var express = require('express');
const Users = require('../models/Users');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});


router.get('/new' , (req,res, next)=>{
  res.render('newUser' , {error: req.flash('error')[0]})
})


router.get('/login' ,(req, res, next)=>{
  var error = req.flash('error')
  res.render('login', {error});
})

router.post('/' ,(req,res,next)=>{
  Users.create(req.body, (err, user)=>{
    if(err){
      if(err.name === 'MongoError'){
        req.flash('error', 'This email already exist')
      }
      if(err.name === 'ValidationError'){
        req.flash('error', err.message)
      }
      return res.redirect('/users/new');
    }
    res.render('login');
  })
})


router.post('/login', (req, res, next)=>{
  console.log(req.body);
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


router.get('/logout' , (req, res, next)=>{
  req.session.destroy();
  res.clearCookie();
  res.redirect('/users/login')
})



module.exports = router;
