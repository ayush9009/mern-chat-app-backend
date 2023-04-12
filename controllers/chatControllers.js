const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const accessChat = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({//now we check if the user with this id exist or not
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: req.userId } } },
        ]
    }).populate("users", "-password").populate('latestMessage');  //password ko chodkar sab display kardo
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })  //sort from new to all
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });

                res.status(200).send(results);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
const createGroupChat = asyncHandler(async (req, res) => {
    // we take number of users from the body and name the grop
    if (!req.body.users || !req.body.name) { //if req.body.users dont have anything or req.body.name dont have anything we say please fill all the fields
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);  //fronm the frontend we send array of objects stringiggy and in backend we parse it and store that objects
    if (users.length < 2) {// mtlb grp mai kam se kam do log to hone chaiye
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);  //mtlb baki sab to user ho hi sath mai vo bhi user ho jo grp bnaa ra yaha jo abhi login hai


    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,   //jo user ne frontend pai request kara kiye grp chat name to vo hmne rak diya
            users: users,  //users mai vo sab users ajaye jo apne user mai add kare hai
            isGroupChat: true, //grpChat ko true kuki ye grp chat hone vali hai
            groupAdmin: req.user,  //admin jisne login kar raka vo hi admin bnega
        });
        // now above line mai jo likha us sey database mai store hogya lkain hum frontend pai bhi show karna uske liye backend se sara data fetch karo aur show kar do
        // neeche ab jo lines likhogey usme vo hi sab likha jayega
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")   //yani show kar do users lakin password mat show karo
            .populate("groupAdmin", "-password");  //password of admin chokdkar admin ko bhi show kar do
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//rename a group

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(  //is function ki madath se hum grp find krenge ,kaise ,sabse pahle to us grp ki id nikalo then us grp ka name nikalo
        chatId, {   //ye chatId jissey hum find karrai
        chatName  //is name hum search kar rai
    },
        {
            new: true,   //agr ye new true na kare to old value dedega
        }
    )
        .populate("users", "-password")   //yani show kar do users lakin password mat show karo
        .populate("groupAdmin", "-password");

    if (!updateChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updateChat);
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    //we need two things the chat id in which we want to add the user,and the
    // user id that we wnat to add in the chat
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {   //jo userid vo find karo then jo users thai usme us user ko i.e us user ki id ko push kar do
            $push: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")   //yani show kar do users lakin password mat show karo
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }


})

const removeFromGroup = asyncHandler(async (req, res) => {
    //we need two things the chat id in which we want to add the user,and the
    // user id that we wnat to add in the chat
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {   //jo userid vo find karo then jo users thai usme us user ko i.e us user ki id ko push kar do
            $pull: { users: userId },   //added to grp mai yaha push ,lakin ab pull ki users mai is particular id ko nikal do
        },
        { new: true }
    )
        .populate("users", "-password")   //yani show kar do users lakin password mat show karo
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }


})


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };



// .then(result =>
//     res.send(result)
// );