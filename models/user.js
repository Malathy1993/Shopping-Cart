var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = Schema({
    email : {type : String, require : true},
    password : {type : String, require : true}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}

userSchema.methods.confirmPassword = function(password){
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User',userSchema);