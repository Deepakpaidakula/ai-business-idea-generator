const Chat = require("../models/Chat");
const User = require("../models/User");


const sendMessage = async (req, res) => {
  try {
    const { message, to } = req.body;

    if (!message || !to) {
      return res.status(400).json({ success: false, error: "Message and recipient required" });
    }

    const chat = await Chat.create({
      from: req.user._id,
      to,
      message,
    });

    res.status(201).json({ success: true, chat });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Chat.find({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { sendMessage, getMessages };
