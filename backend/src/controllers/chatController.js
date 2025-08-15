const Chat = require("../models/Chat");

// Send a new chat message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({ success: false, message: "Receiver and message are required" });
    }

    const newMessage = new Chat({
      sender: req.user._id,
      receiver,
      message
    });

    await newMessage.save();

    res.json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all messages between logged-in user and another user
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
