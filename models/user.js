var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    id:String,
    firstName:{
        type:String,
        default:null
    },
    lastName:{
        type:String,
        default:null
    },
    displayName:{
        type:String,
        default:null
    },
    email:{
        type:String, 
        unique:true, 
        required:true
    },
    password:String,
    image:String,
    imageID:{
        type:String,
        default:null
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    isAdmin: {
        type:Boolean,
        default:false
    },
    accessToken:String,
    provider:{
        type:String,
        required:true,
        default:"local"
    },
    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ]
});

UserSchema.plugin(passportLocalMongoose,{usernameField:"email"});

module.exports=mongoose.model("User",UserSchema);