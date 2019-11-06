var mongoose=require("mongoose"),
    Campground=require("./models/campground"),
    Comments=require("./models/comments");

var campground=[
    {
       name: "West Ladakh Camp",
       image: "https://www.holidify.com/images/cmsuploads/compressed/24366507140_38f32204a4_z_20190212174301.jpg",
       description: "West Ladakh camp is located near Ulley Topko / Alchi (Ladakh) at the bank of Indus river in a 20 acre ranch."
    },
    {
        name: "Tso Moriri Lake",
        image: "https://www.holidify.com/images/cmsuploads/compressed/640px-Tsomoriri_Lake_DSC4010_20190212171119.jpg",
        description: "Tso Moriri or Lake Moriri is a lake in the Ladakhi part of the Changthang Plateau in Jammu and Kashmir in Northern India. The lake and surrounding area are protected as the Tso Moriri Wetland Conservation Reserve."
     },
     {
        name:"Nameri Eco Camp",
        image:"https://www.holidify.com/images/cmsuploads/compressed/4877785757_958e85201d_z_20190212174518.jpg",
        description:"Nameri Eco Camp is categorised as Standard Jungle Lodge. ... Eco Camp is located near Nameri National Park and Tiger Reserve in Assam comprising of thatched tented accommodation in a spread out area. Nameri Eco Camp is located near Nameri National Park offering thatched accommodation"
     }
]
function seed(){
   Campground.deleteMany({},function(err){
       if(err)
          console.log(err);
        else
          console.log("Campgrounds Removed");
   });  

//    campground.forEach(function(camp){
//       Campground.create(camp,function(err,data){
//           if(err)
//              console.log(err);
//           else
//           {
//             Comments.create(
//             {
//                 text:"new comment", 
//                 author: "Aayush"
//             },function(err,comment){
//                 if(err)
//                     console.log(err);
//                 else
//                 {
//                     data.comments.push(comment);
//                     data.save();
//                     console.log("Data Added");
//                 }   
//             });      
//           }
//       });
//    });  
}
module.exports=seed;