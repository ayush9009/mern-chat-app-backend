//mongoose:with the help of mongoose we write queries for our mongodb daatabe ,schema,models and all of this are using mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},
    { timestaps: true }

);

// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password); //comparison between jo user ne password abhi dala aur jo pahle se databse mai hai
// }
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//userSchema.pre mtlb save karne se pahle ye kam karo,async func next because it is going to be  middleware
// userSchema.pre('save', async function (next) {
//     if (!this.isModified) {  //mtlb current password agr modify ni huha to ye sab karo
//         next();   //means dontrun the code after it
//     }
//     //    yani agr password modify ni kiya to hum pahle password ko bcrypt kar rai phir store karenge databse
//     // otherwise 
//     const salt = await bcrypt.genSalt(10);  //higher the number stronger the password 
//     this.password = await bcrypt.hash(this.password, salt);
// })
userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;