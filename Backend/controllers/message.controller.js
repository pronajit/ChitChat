const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const Group = require("../models/group.model");
const User = require("../models/user.model");
const cloudinary = require("./../Utils/cloudinary");
const getDataUri = require("./../Utils/datauri");
const {io , userSocketMap} = require("../Socket");

// helper: file mime -> messageType
const mapMimeToType = (mime = "") => {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
};


const sendPrivateMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id; // receiverId is mandatory
    const { text } = req.body;
    const file = req.file;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }
    if (!text && !file) {
      return res.status(400).json({ success: false, message: "Provide text or file" });
    }

    // 1) Conversation find/create (strict 1-1)
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // 2) Media (optional) -> Cloudinary
    let mediaUrl = null;
    let messageType = text ? "text" : "file";
    if (file) {
      const fileUri = getDataUri(file);
      const upload = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
      });
      mediaUrl = upload?.secure_url;
      messageType = mapMimeToType(file.mimetype);
    }

    // 3) Message create
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      conversationId: conversation._id,
      text: text || undefined,
      mediaUrl: mediaUrl || undefined,
      messageType,
      status: "sent",
    });

    // 4) Conversation.latestMessage update
    conversation.latestMessage = message._id;
    await conversation.save();

    // (optional) populate sender minimal
    await message.populate({ path: "sender", select: "username profilePic" });

    const receiverSocketId = userSocketMap.get(receiverId);
    const senderSocketId = userSocketMap.get(senderId);
    // console.log("Trying to emit:", { receiverId, receiverSocketId, messageId: message._id });
    if (receiverSocketId) {
      console.log("Emitting to receiver:", receiverSocketId);
      io.to(receiverSocketId).emit("new-message", message);
    }
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      console.log("Emitting to sender:", senderSocketId);
      io.to(senderSocketId).emit("new-message", message);
    }

    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("sendPrivateMessage error:", error);
    return res.status(500).json({ success: false, message: "Failed to send private message", error: error.message });
  }
};


const getPrivateMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }

    // const page = parseInt(req.query.page || "1", 10);
    // const limit = parseInt(req.query.limit || "20", 10);
    // const skip = (page - 1) * limit;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [],  hasMore: false });

    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 }) // newest first in query
      // .skip(skip)
      // .limit(limit)
      .populate({ path: "sender", select: "username profilePic" });

    // const total = await Message.countDocuments({ conversationId: conversation._id });
    // const hasMore = skip + messages.length < total;

    // frontend ko oldest->newest chahiye to reverse kar lo:
    // messages.reverse();

    // return res.status(200).json({ success: true, messages, page, hasMore });
    return res.status(200).json({ success: true, messages});
  } catch (error) {
    console.error("getPrivateMessages error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch messages", error: error.message });
  }
};


const sendGroupMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const groupId = req.params.id;
    const { text } = req.body;
    const file = req.file;

    if (!groupId) {
      return res.status(400).json({ success: false, message: "Invalid groupId" });
    }
    
    if (!text && !file) {
      return res.status(400).json({ success: false, message: "Provide text or file" });
    }

    // 1) Group find
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // 2) Membership check
    const isMember = group.members.some(m => String(m) === String(senderId));
    if (!isMember) {
      return res.status(403).json({ success: false, message: "You are not a member of this group" });
    }

    // 3) Media (optional)
    let mediaUrl = null;
    let messageType = text ? "text" : "file";
    if (file) {
      const fileUri = getDataUri(file);
      const upload = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
      });
      mediaUrl = upload?.secure_url;
      messageType = mapMimeToType(file.mimetype);
    }

    // 4) Message create
    const message = await Message.create({
      sender: senderId,
      groupId: group._id,
      text: text || undefined,
      mediaUrl: mediaUrl || undefined,
      messageType,
      status: "sent",
    });

    await message.populate({ path: "sender", select: "username profilePic" });

    const members = group.members;
    // console.log("Group members:", members);

    for (const memberId of members) {
      const receiverSocketId = userSocketMap.get(memberId.toString());
      if (receiverSocketId) {
        console.log("Emitting group message to:", receiverSocketId);
        io.to(receiverSocketId).emit("new-groupMessage", message);
      }
    }

    // NOTE: Group schema me latestMessage field nahi hai; agar chaho to add karke update kar sakte ho.
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("sendGroupMessage error:", error);
    return res.status(500).json({ success: false, message: "Failed to send group message", error: error.message });
  }
};


const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.id; // support two routes
    // const page = parseInt(req.query.page || "1", 10);
    // const limit = parseInt(req.query.limit || "20", 10);
    // const skip = (page - 1) * limit;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const filter = { groupId: group._id };
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit)
      .populate({ path: "sender", select: "username profilePic" });

    // const total = await Message.countDocuments(filter);
    // const hasMore = skip + messages.length < total;

    // messages.reverse(); // oldest -> newest for UI

    // return res.status(200).json({ success: true, messages, page, hasMore });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getGroupMessages error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch group messages", error: error.message });
  }
};

module.exports = {
  sendPrivateMessage,
  getPrivateMessages,
  sendGroupMessage,
  getGroupMessages,
};
