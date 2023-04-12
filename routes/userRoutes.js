//in this we write all the routes related to the user

const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//protect agya pahle taki user authenciated hona cahiye tabhi request kar sake nahi to error ajaye
//means before going to allUsers it has to go through protect middlware
router.route("/").post(registerUser).get(protect, allUsers);   //protect lagane ka mtlb authentication ,agr login ha tabhi searching possible

// upr vali line ka matlb / to register user kai liye bhi ,aur get allusers kai liye bhi
//ya to aaap jasie upr likha aise liklo ya jaise neecha leekha aise leekhlo as you wish
router.post('/login', authUser);
//ab ye registerUser and authUser controllers bhi to bnane hai
// with the help of router we create different different routes

module.exports = router;