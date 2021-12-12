const mongoose = require('mongoose');
mongoose.Promise = Promise;

var MONGO_DB_CONNECTION_URL = "mongodb+srv://Nitish:Nitish@123@cluster0.vhzvz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; 
// this is URL used with credentials

function mongoConnect() {
    mongoose.connection.openUri(
        MONGO_DB_CONNECTION_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function(err) {
            if (err) {
                console.error("Error: ", err);
            }
            console.log("Connected.... Unless You See An Error The Line Before This..!!");
        });
    mongoose.set('debug', true);
}

module.exports = { mongoConnect }