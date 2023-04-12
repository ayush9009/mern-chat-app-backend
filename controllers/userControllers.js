// //if there is any error in this controller we have to handle that error
// // with the help of express-asynce-handler ki madth se hum sari error handles kar lenge
// const asyncHandler = require("express-async-handler");
// const generateToken = require("../config/generateToken");
// const User = require("../models/userModel");
// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password, pic } = req.body;
//     // to here we have to check if any of them is undefined so we have to throw error
//     // since we are takingvallues from the frontend we are need to tell the server  to accept json data
//     if (!name || !email || !password) {
//         res.status(400);
//         throw new Error("Please enter all the fields");
//     }
//     //now we have to check if the user already exists in the database or not
//     // if yes so we dont register it again
//     //find one is query for checking in mongodb that particular enter exists or not
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//         res.status(400);
//         throw new Error("User already exists");
//     }

//     const user = await User.create({
//         name,
//         email,
//         password,
//         pic,
//     });
//     if (user) {
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             pic: user.pic,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(400);
//         throw new Error("Failed to create the user");
//     }

//     //now i want when a new user is create it send jwt token to the user
// });

// //login
// const authUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             pic: user.pic,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(401);
//         throw new Error("Invalid Email or Password");
//     }
// });

// //  /api/user
// // now how we can send data to backend,there are two ways to send it
// // one way is sent through body using post request 
// // another way using query like /api/user?search=ayush
// const allUsers = asyncHandler(async (req, res) => {
//     // deko agr hota /api/:id to hum const keyword=req.params.id,lakin yaha query to uske liye
//     // const keyword = req.query; to bhai console yani terminal pai name vagera show hojaga user ka firstname lastname
//     // const keyword = req.query.search; //to user ka naam show hojaga termial pai 
//     // console.log(keyword);

//     // WHAT IS REGEX?
//     // ans-> REGEX PROVIDES REGULAR EXPRESSIONS CAPABILITES
//     //  FOR PATTERN MATCHING STRINGS IN QUERIES


//     const keyword = req.query.search ? { //if there is any query then we search name email in it
//         $or: [  //or mongodb operator whcih says if any of the statement is correct then return true
//             // regex:string,$options to req.query.search ye apki string jo ya kahe jise kimatching aap dund rai
//             { name: { $regex: req.query.search, $options: "i" } },   //to ye hum regex ki madth se check kare ki mongodb pai jo abhi user ka name hai vo kya mongodb mai,aise
//             //    aise hi email check hori using regex and options means case insensitive to match upper case and lower case alg alg options hove 
//             // lakin humne yaha i yani case insenstive raka yani aayush aur AAYUSH done ek hi mane jayegi,kuki case insensitive hai 
//             { email: { $regex: req.query.search, $options: "i" } },
//         ],
//     }
//         : {};  //yani else we dont do anything
//     // basiccally is keyword mai vo sab expressions agye jo aapko searach karne

//     const users = await (await User.find(keyword)).findIndex({ _id: { $ne: req.user._id } });
//     // agr user login ho tabhi serach kar paye
//     res.send(users);
//     //except this user return every other user
//     // / //baki sab users ko nikalo sivaye uske jo abhi login yanijo req.user._id ise chodkar baki sab nikalo (ne means not equal ,i.e id:{$ne:req.user._id} is trah liki ja ye sab ki id not equal to userid  
//     // ab is keyword mai vo sab hai jo aapko match karna ya
//     //  kahe find karna ki aisa koi deko pahle to regex ki madaath se check kar
//     // liya hai ya nhi ,aur phir keyword vo sab aa chuke name and email to find method se datbase 
//     // se us user ki hum sari infomration miljayegi mtlb user.find(aayush,aayusharma0220@email.com) 
//     // is user ko find karo aur uski infomration sab users mai store karlo
// })










// module.exports = { registerUser, authUser, allUsers };

// // use of jwt toeken: jwts are a good way of securely transmitting information
// // betweeen parties because they be signed which means you can be sure that senders are who they say they are
// // the most scenario for using a jwt is  authentication ,when the user logged in
// // each subsequent request includes the jwt which allows the user to access serivces that are permitted
// // by that token







const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

module.exports = { allUsers, registerUser, authUser };







































































