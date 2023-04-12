//in this file we connect to our database

const mongoose = require("mongoose");


mongoose.Promise = global.Promise;
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
        });
        // console.log("hello");
        console.log("MongoDB Connected !!! ");
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);  //passing 1 will exit the process with error
    }
}
module.exports = connectDB;
