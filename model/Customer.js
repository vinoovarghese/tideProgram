const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({

name :
 {type : String,
        required : true},
email :{type : String,
        required : true,
        unique : true},
address : {type : String},

currency : { type : String}


});
module.exports=Customer=mongoose.model("customer",CustomerSchema);