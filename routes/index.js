var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i<docs.length; i +=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    // console.log("productChunks : ",productChunks);
    res.render('shop/index', { title: 'Express' , products : productChunks});
  });
});

router.get('/user/signup', (req, res, next) => {
  var messages = req.flash('error');
  console.log("messages : ",messages);
  res.render('user/signup', 
  {csrfToken : req.csrfToken(),
  messages : messages,
  hasError : messages.length > 0})
})

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect : '/user/profile',
  failureRedirect : '/user/signup',
  failureFlash : true
}))

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile')
})

router.get('/user/signin', (req, res, next) => {
  var messages = req.flash('error');
  console.log("messages : ",messages);
  res.render('user/signin', 
  {csrfToken : req.csrfToken(),
  messages : messages,
  hasError : messages.length > 0})
})

router.post('/user/signin', passport.authenticate('local.signin',{
  successRedirect : '/user/profile',
  failureRedirect : '/user/signin',
  failureFlash : true
}))

module.exports = router;
