const express = require('express');
const router = express.Router();
const Customer = require("../../model/Customer");
const Orders = require("../../model/Orders");
const mongoose = require("mongoose");
const Logger = require("../../config/logger");

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
    check("currency", "Currency is required.").not().isEmpty(),
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
        Logger.log("info",customer.name + " was succesfully registered !!!");
        res.json({message:customer.name + " was succesfully registered !!!",customer});
       
       
      }
    } catch (err) {
      Logger.log("error","Error has occured " + err.message);
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
    Logger.log("error","Error has occured " + error.message);
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
    Logger.log("error","Error has occured " + error.message);
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
    
    const allCustomerOrders = await Orders.find({customer:req.params.custId});

    // Delete the orders of the customer who is going to be deleted.

    const ordersDeleted = await Orders.deleteMany({customer:req.params.custId});
    Logger.log("info","Orders deleted : " + ordersDeleted);

    //Delete the customer

    const deletedCustomer = await Customer.findOneAndRemove({ _id: req.params.custId });
    Logger.log("info",deletedCustomer.name +" was deleted : " + deletedCustomer);
    res.json({message: deletedCustomer.name + " was deleted !!! " , deletedCustomer,allCustomerOrders});


  } catch (error) {
    
    Logger.log("error","Error has occured " + error.message);
    res.status(500).message("error");
  }

});

//Route to update a specific customer by passing the customer (As of now,only name,address and currency can be changed)

router.put("/:custId",
[
  //Validating name/address and currency.Email is a unique field and ideally should not be changed.
   
  check("name", "Name is required.").not().isEmpty(),
  check("email", "Email can not be updated.").isEmpty(),
  check("address", "Address is required.").not().isEmpty(),
  check("currency", "Currency is required.").not().isEmpty(),

 ],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get details from the request body
  const { name, address,currency} = req.body;

  //Create a CustomerObject to store details from the request body

  const CustomerObject={};
  CustomerObject.name=name;
  CustomerObject.address=address;
  CustomerObject.currency=currency;

  try {

    //Find out whether the customer exists or not

    const customerToBeUpdated = await Customer.findById({_id: req.params.custId});

    if(!customerToBeUpdated) {

      return res.status(404).send({ message: " No such customer with the customerid  :  " + req.params.custId + " exists !!!"});
    }

    const customerUpdated = await Customer.findOneAndUpdate(
                {_id: req.params.custId},
                { $set: CustomerObject},
                { new: true }
              ); 
   
    Logger.log("info","After updating customer ",customerUpdated);
    return res.json({message: customerUpdated.name + " was updated !!! " , customerUpdated});
       
  } catch (error) {
    Logger.log("error","Error has occured " + error.message);
    res.status(500).send(message,"Some error has occured " , error.message);
  }
  }
  
);



module.exports=router;