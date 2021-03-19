var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var user = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    password:{type: String, required:true, minlength:5},
  },{
      timestamps:true
})


user.pre('save' , function(next){
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hashed)=>{
            if(err) return next(err);
            this.password = hashed;
            return next()
        })
    }else{
        next()
    }
})

user.methods.verifyPassword = function (password , cb) {
    bcrypt.compare(password, this.password, (err, result)=>{
        return cb(err, result)
    })
}

module.exports = mongoose.model('Users', user);