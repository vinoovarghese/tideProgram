const express = require("express");
const router = express.Router();
const Customer=require("../../model/Customer");
const Orders = require("../../model/Orders");

const { check, validationResult } = require("express-validator");

router.get("/",(req,res)=> 
{
    res.send("Default router from Orders page");
});

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

            let existingCustomer = await Customer.findById(req.params.customerId);
            if(!existingCustomer) {
                return res.status(400).json({ errors: [{ message: "There is no customer with  this " + req.params.customerId }] });
            } else {

                let newOrderObject = {
                    customer: req.params.customerid,
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


);

module.exports=router;