const mongoose = require('mongoose');
const OrdersSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
       },
        description: {
                type: String,
                required: true
            },
        quantity: {
                type : Number,
                required : true,
            },

        value: {
                type : Number,
                required : true 
            }
});
module.exports=Orders=mongoose.model("orders",OrdersSchema);