var mongoose=require("mongoose");

var commmentSchema=new mongoose.Schema({
    text:String,
    author:{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});

module.exports=mongoose.model("Comments",commmentSchema);