const express = require('express');
const router = express.Router();
const Customer = require("../../model/Customer");

router.get("/",(req,res)=> 
{
    res.send("Hello from Customer page")
});

module.exports=router;