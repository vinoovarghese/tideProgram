const express = require('express');
const app = express();
const port=5000;
const dbConnection = require("./config/db")
const customerRouter = require("./routes/apis/customer");
const ordersRouter = require("./routes/apis/orders");
const Logger = require("./config/logger");


dbConnection();
app.use(express.json({ extended: false }));

app.get("/",(req,res)=> {

 res.send("Default route for the TIDE program main server.js file.");
});

app.listen(process.env.PORT || port,()=> {

Logger.log("info","Server started on port " + port);
    
});

//Routes for customers and orders


app.use("/v1/api/customers",customerRouter);
app.use("/v1/api/orders",ordersRouter);