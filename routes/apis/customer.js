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
    //Validations as to whether it's a valid email address and that name/address/currency are not blank.

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

    // First,find out whether the customer already exists using the email.
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
       res.json({message:customer.name + " was succesfully registered !!!",customer});
       
       
      }
    } catch (err) {
      console.log("Error has occured " + err.message);
      res.status(500).send("error");
    }
  }
);

//Route to get the list of all customers present

router.get("/allCustomers", async (req, res) => {
  try {
     const allCustomers = await Customer.find().populate("customer");
     res.json({message:"List of customers below : " , allCustomers});
   
  } catch (error) {
    console.log(error.message);
    res.status(500).message("error");
  }
});

// Route to get a particular customer provided you give the customer id

 router.get("/:custId", async (req, res) => {
  try {

    //Find out whether the customer exists or not

    const customerFound = await Customer.findById(req.params.custId);
    
    if (!customerFound) {
         return res.status(404).send({ message: "No such customer with the customerid  : " + req.params.custId + " exists !!!"});
    }
    res.json({message:"Customer details below : " , customerFound});
        
  } catch (error) {
    console.log(error);
    res.status(500).message("error");
  }
});

// Route to delete a customer 

router.delete("/:custId",async (req, res) => {

  try {
    
    //Find out whether the customer exists or not

    const customerToBeDeleted = await Customer.findById({_id: req.params.custId});
    if(!customerToBeDeleted) {
       
      return res.status(404).send({ message: "No such customer with the customerid  :  " + req.params.custId + " exists !!!" });
    }

    const deletedCustomer = await Customer.findOneAndRemove({ _id: req.params.custId });
    console.log("Customer was deleted " + deletedCustomer);
    res.json({message: deletedCustomer.name + " was deleted !!! " , deletedCustomer});


  } catch (error) {
    
    console.log(error);
    res.status(500).message("error");
  }

});


module.exports=router;