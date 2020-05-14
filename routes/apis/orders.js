const express = require("express");
const router = express.Router();
const Customer=require("../../model/Customer");
const Orders = require("../../model/Orders");

const { check, validationResult } = require("express-validator");

router.get("/",(req,res)=> 
{
    res.send("Default router from Orders page");
});


// Route to create a new order for a customer

router.post(
    "/:customerId",
    [
    check("description", "Description is required.").not().isEmpty(),
    check("quantity", "Quantity is required.").not().isEmpty(),
    check("quantity", "Quantity should be specified as a numeric value.").isNumeric(),
    check("value", "Value is required.").not().isEmpty(),
    check("value", "Value should be specified as a numeric value.").isNumeric()
    
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { description, quantity, value } = req.body;

        try {
            
            //find whether the customer given is a valid customer.

            let existingCustomer = await Customer.findById(req.params.customerId);
            if(!existingCustomer) {
                return res.status(400).json({ errors: [{ message: "There is no customer with  this " + req.params.customerId }] });
            } else {

                let newOrderObject = {
                    customer: req.params.customerId,
                    description,
                    quantity,
                    value,
                  };

                  var newOrder = new Orders(newOrderObject);
                  newOrder = await newOrder.save();
                  console.log(existingCustomer.name + " has succesfully placed an order !!");
                  res.json({message:existingCustomer.name + " has succesfully placed an order .",newOrder});
            }
            
        } catch (error) {
            console.log("Error has occured " + err.message);
            res.status(500).send("error");
        }

    }

    //


);

// Route to retrieve all orders for a customer

router.get("/allOrders/:customerId", async (req, res) => { 

    try {
    
        let existingCustomer = await Customer.findById(req.params.customerId);
            if(!existingCustomer) {
                return res.status(400).json({ errors: [{ message: "There is no customer with  this customer id : " + req.params.customerId }] });
            } 
           const allOrders = await Orders.find({customer: req.params.customerId}).populate("customer", ["name","address","currency"]);
           if(allOrders.length==0) {
            return res.status(400).json({ errors: [{ message: "There are no orders for this customer with this customerId" + req.params.customerId }] });  
           }
           res.json({message:"Orders for this customerId :" + req.params.customerId + " are below : ",allOrders});
     } catch (error) {
       console.log(error.message);
       res.status(500).message("error");
     }
   });

 //Route to get a particular orderId 

 router.get("/:orderId", async (req, res) => {
     try {
          const orderDetails = await Orders.findById(req.params.orderId).populate("customer", ["name","address","currency"]);
          if (!orderDetails) {
            return res.status(400).json({ message: "This orderid : "+ req.params.orderId + " is not valid !"});
          }
          res.json({message:"Details for this orderId :" + req.params.orderId + " are below : ",orderDetails});

     } catch (error) {
         res.status(500).send(error.message);
     }
     
 });


module.exports=router;