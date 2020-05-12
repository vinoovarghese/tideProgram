const express = require("express");
const router = express.Router();
const Customer=require("../../model/Customer");
const Orders = require("../../model/Orders");

const { check, validationResult } = require("express-validator");

router.get("/",(req,res)=> 
{
    res.send("Default router from Orders page");
});

module.exports=router;