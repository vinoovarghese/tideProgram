const express = require('express');
const router = express.Router();
const Customer = require("../../model/Customer");
const mongoose = require("mongoose");

const { check, validationResult } = require("express-validator");



router.get("/",(req,res)=> 
{
    res.send("Default router from Customer page")
});

// Create a new Customer
router.post(
  "/",
  [
    //Validations to be verified using .

    check("name", "Name is required.").not().isEmpty(),
    check("email", "Please enter a valid email.").isEmail(),
    check("address", "Address is required.").not().isEmpty(),
    check("currency", "Currency is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address,currency } = req.body;

    // First,find out whether the user already exists using the email.
     try {
      let customer = await Customer.findOne({
        email,
      });
      if (customer) {
        return res.status(400).json({ errors: [{ message: "Customer already exists ." }] });
      } else {
        

        customer = new Customer({
          name,
          email,
          address,
          currency
        });
      
        customer = await customer.save();
       
       console.log(customer.name + " was succesfully registered !!!");
       res.json({message:customer.name + " was succesfully registered !!!",Object:customer});
       
       
      }
    } catch (err) {
      console.log("Error has occured " + err.message);
      res.status(500).send("error");
    }
  }
);


module.exports=router;