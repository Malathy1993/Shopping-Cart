var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

// only works when its logged In
router.get('/profile' ,isLoggedIn, (req, res, next) => {
    res.render('user/profile')
})

router.get('/logout',isLoggedIn, (req, res, next) => {
    req.logout();
    // console.log("req.isAuthenticated() out: ",req.isAuthenticated());
    req.flash("error","You have logged out")
    res.redirect('/');
  })
// Reversely
router.use('/' ,notLoggedIn, (req, res, next) => {
next();
})

router.get('/signup', (req, res, next) => {
    var messages = req.flash('error');
    console.log("messages : ",messages);
    res.render('user/signup', 
    {csrfToken : req.csrfToken(),
    messages : messages,
    hasError : messages.length > 0})
  })
  
  router.post('/signup', passport.authenticate('local.signup',
  {
    failureRedirect : '/user/signup',
    failureFlash : true
  }),(req, res, next) => 
  {
    if(req.session.oldUrl){
      var url =  req.session.oldUrl ;
      req.session.oldUrl = null;
      res.redirect(url);
    }
    else{
      res.redirect('/user/profile')
    }
  })
  
  router.get('/signin', (req, res, next) => {
    var messages = req.flash('error');
    console.log("messages : ",messages);
    res.render('user/signin', 
    {csrfToken : req.csrfToken(),
    messages : messages,
    hasError : messages.length > 0})
  })
  
  router.post('/signin', passport.authenticate('local.signin',{
    failureRedirect : '/user/signin',
    failureFlash : true
  }),(req, res, next) => 
  {
    if(req.session.oldUrl){
      var url =  req.session.oldUrl ;
      req.session.oldUrl = null;
      res.redirect(url);
    }
    else{
      res.redirect('/user/profile')
    }
  })

  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        //   console.log("req.isAuthenticated() : ",req.isAuthenticated());
          
          return next();
      }
      res.redirect('/');
  }

  function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

  module.exports = router;