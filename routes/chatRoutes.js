const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route('/').post(protect, accessChat);  //this for reading the chat or creating a chat,lakin tabhi posible hai login else error ajagi (protect middleare laga raka,ki sirf authenicated vale hi access kar paye)
router.route('/').get(protect, fetchChats);//this route gives the chat of a particular user
router.route('/group').post(protect, createGroupChat);//this route creates the group chat
router.route('/rename').put(protect, renameGroup);//this route  rename a group that means you update the grop name so put request
router.route('/groupadd').put(protect, addToGroup);//this route  rename a group that means you add person into the grop  so put request
router.route('/groupremove').put(protect, removeFromGroup);//this route  rename the person from a group


module.exports = router;