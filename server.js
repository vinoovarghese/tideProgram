const express = require('express');
const app = express();
const port=5000;
const dbConnection = require("./config/db")
const customerRouter = require("./routes/apis/customer")

dbConnection();

app.get("/",(req,res)=> {

 res.send("TIDE program");
});

app.listen(process.env.port || port,()=> {

    console.log("Server started on port " + port);
});

app.use("/v1/customers",customerRouter);