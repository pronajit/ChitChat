const mongoose = require('mongoose');

const convoSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", convoSchema);

