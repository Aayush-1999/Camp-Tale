var mongoose=require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    id:String,
    firstname:String,
    lastname:String,
    email:{type:String, unique:true, required:true},
    username:{type:String, unique:true, required:true},
    password:String,
    avatar:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    isAdmin: {type:Boolean,default:false},
    token:String,
    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ],
    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User'
    	}
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);