var mongoose = require('mongoose');
var Product = require('../models/product');
mongoose.connect('mongodb://localhost/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var products = [
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls1",
        description : "I died",
        price : 34,
    }),
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls2",
        description : "I died",
        price : 34,
    }),
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls",
        description : "I died3",
        price : 34,
    }),
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls",
        description : "I died4",
        price : 34,
    }),
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls",
        description : "I died5",
        price : 34,
    }),
    new Product({
        imagePath : "https://www.pulse.lk/wp-content/uploads/2016/07/mandalay-bay-retail-resort-shops-shopping-bags.tif.jpg",
        title : "Dark Souls",
        description : "I died6",
        price : 34,
    })
];

var done = 0;
for(var i=0; i<products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length)
            {
                exit();
            }
    })
    
}

function exit(){
    mongoose.disconnect();
}