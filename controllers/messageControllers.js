const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


//send message:this is used to send a message from a single chat
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        //Message messagemodel hai,ki aapne databse mai kasie store kar rake message
        var message = await Message.create(newMessage);  //to ye new message create hojaga jo MessageModel ko followkarke bna hai

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {  //find the id and update that  chat with the latestmessage
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//allMessages
//this is used to fetch all the messages from a particular chat
const allMessages = asyncHandler(async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
            .populate(
                "sender",
                "name pic email"
            )
            .populate("chat");
        res.json(message);
        //why req.params.id aapne  api/chat:id  to ye chat:id ye params mai store hoja to isliye jo req ari usme jo params hai usme humari id store ho jagi to use accesskarlo
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, allMessages };