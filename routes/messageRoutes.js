// first route for sending the Message
// second route for fetch the message for a particular chat

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");

const router = express.Router();

router.route('/').post(protect, sendMessage); //protected bana diya using protect middleware ki agr login hai to hi message send kar sake
router.route('/:chatId').get(protect, allMessages); //we fetch all the messages for a single chat 

module.exports = router;
// yaha to api/route  bna rai ,ki ye agr route hai to ye cheez chlni chaiye vo bta rai,
// controlles mai lik rai agr /api/user/message route hai to kya kya karna chaiye