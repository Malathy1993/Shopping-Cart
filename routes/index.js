var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

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
module.exports = router;
