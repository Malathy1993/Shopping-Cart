var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order')

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i<docs.length; i +=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    // console.log("productChunks : ",productChunks);
    res.render('shop/index', 
    { title: 'Express', products : productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, (err, product) => {
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log("session cart : ",req.session.cart);
    
    res.redirect('/');
  })
})

router.get('/shopping-cart', (req, res, next) => {
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products : null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products : cart.generateArray(),
    toalPrice : cart.totalPrice
  })
})

router.get('/checkout', (req,res) => {
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  // cart obj wo constructor also possible
  var cart = req.session.cart;
  var errMsg = req.flash('error')[0];
  // console.log("cart",req.session.cart);
  
  res.render('shop/checkout',{total : cart['totalPrice'], errMsg: errMsg, noError: !errMsg})
})

router.post('/checkout', function(req, res, next) {
  if (!req.session.cart) {
      return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  
  var stripe = require("stripe")(
      "sk_test_cYsMLlKJrGqEXXg6AoAJuBPG00BcNeqXbS"
  );

  stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "eur",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
  }, function(err, charge) {
      if (err) {
          req.flash('error', err.message);
          console.log("error in server");//card no : 4000000000009995
          
          return res.redirect('/checkout');
      }
      console.log("Stripe Token : ",req.body.stripeToken);

      var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
      });
      order.save(function(err, result) {
          req.flash('success', 'Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
      });
  }); 
});
module.exports = router;
