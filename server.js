const express = require('express');
const app = express();
const port=5000;
const dbConnection = require("./config/db")
const customerRouter = require("./routes/apis/customer")

dbConnection();
app.use(express.json({ extended: false }));

app.get("/",(req,res)=> {

 res.send("Default route for the TIDE program main server.js file.");
});

app.listen(process.env.port || port,()=> {

    console.log("Server started on port " + port);
});

app.use("/v1/api/customers",customerRouter);