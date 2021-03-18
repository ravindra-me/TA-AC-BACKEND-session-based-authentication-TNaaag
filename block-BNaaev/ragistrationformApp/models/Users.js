var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt =require('bcrypt');

var users = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password:{type: String, required:true, minlength:5},
  age:Number,
  phone:{type:Number},
},{
    timestamps:true
});


users.pre('save' , function(next){

    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password , 10 , (err, hashed)=> {
            if(err) return next(err)
            this.password = hashed;
            return next()
        })
    }else{
        next()
    }
})



module.exports = mongoose.model('Users' , users);