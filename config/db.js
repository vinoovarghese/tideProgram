const mongoose = require('mongoose');
const config = require("config");
const dbStringUrl = config.get("dbconnection");
const Logger = require("./logger");

const getDbConnection = async() => {

try {
    
    await mongoose.connect(dbStringUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
    })
    
    Logger.log("info","Mongo Db connection was successful .");
} catch (error) {
    
    Logger.log("error","Error connecting to the Mongo DB " + error.message);
}

}
module.exports=getDbConnection;