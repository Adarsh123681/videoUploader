const mongoose = require("mongoose");
const connection = mongoose.connect("mongodb://localhost:27017/videoPlayer" , {
});
if(connection){
  console.log("connected")
}
else{
  console.log("not connected");
}