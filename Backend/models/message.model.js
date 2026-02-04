// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // one-to-one ke liye direct
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",   // optional (agar normal chat ke through send hua hai)
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",  // optional (agar group me send hua hai)
  },
  text: {
    type: String,
  },
  mediaUrl:{
    type: String,  // optional (agar media file hai)
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "audio", "video"],
    default: "text",
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
