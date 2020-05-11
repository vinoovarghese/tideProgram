const mongoose = require('mongoose');
const config = require("config");
const dbStringUrl = config.get("dbconnection");

const getDbConnection = async() => {

try {
    
    await mongoose.connect(dbStringUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
    })
    console.log("Mongo Db connection was successful .");
} catch (error) {
    console.log("error connecting to the DB " + error.message);
}

}
module.exports=getDbConnection;