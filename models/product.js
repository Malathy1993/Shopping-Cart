var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    imagePath : {type : String, require : true},
    title : {type : String, require : true},
    description : {type : String, require : true},
    price : {type : Number, require : true},
});

module.exports = mongoose.model('Product',productSchema);