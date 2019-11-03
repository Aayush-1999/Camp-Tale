var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name:String,
    image:String,
    imageId:String,
    description:String,
    createdAt: {type:Date , default:Date.now },
    location:String,
    lat:Number,
    lng:Number,
    author:{
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      username:String
    },
    comments:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref: "Comments"
        }
    ]
 });
 
 module.exports=mongoose.model("Campground",campSchema);
 