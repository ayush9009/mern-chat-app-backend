const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {//kuki ye middleware to isme req,res,next hoga
    let token;
    //token looks like Bearer afakaersdkfn
    // to use token ko humne split kar diya hai
    if (
        req.headers.authorization &&   //req.headers.authorization isme huamra token hai
        //ab hum kah rai req.headers.auh.starts with bearer hora kya
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];    //ab vo joken usme se humne bearer hata diya
            console.log(token);

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);   //ab joken use verfiy kar rao

            req.user = await User.findById(decoded.id).select("-password");    //now we find the user with decoded id and store it into req.user without the password

            next(); //means move to the next operation,otherwise we throw the error
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };