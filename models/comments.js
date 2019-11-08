var mongoose=require("mongoose");

var commmentSchema=new mongoose.Schema({
    text:String,
    author:{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
});

module.exports=mongoose.model("Comments",commmentSchema);