import expressAsyncHandler from "express-async-handler";
import User from "../../models/User";
import Message from "../../models/message";
import ApiError from "../../utils/Error";
import { encryptText, decryptText } from "../../utils/bcryptText";
import { generateAccessToken } from "../../utils/jwt";
import SocketServer from "../../utils/socketServer";

const io = SocketServer.getInstance().io;

const sendMessage = expressAsyncHandler(async (req: any, res: any) => {
  const { content, to } = req.body;
  const senderUser = req.user;

  const reciver = await User.findById(to);
  if (!reciver)
    return res.status(404).json({ err: new ApiError("Receiver not found", 404) });

  if (senderUser._id.toString() === to)
    return res.status(400).json({ err: new ApiError("You can't send message to yourself", 400) });

  const message = new Message({
    content,
    to: reciver._id,
    from: senderUser._id,
    isRead: false,
  });

  await message.save();
  io.emit("newMessage", message);

  await updateContacts(senderUser._id, reciver._id);

  return res.status(201).json({ msg: "Message sent successfully", message });
});

const updateContacts = async (senderId: any, receiverId: any) => {
  const senderContacts = await User.findById(senderId);
  const receiverContacts = await User.findById(receiverId);

  if (!senderContacts?.contacts.includes(receiverId)) senderContacts?.contacts.push(receiverId);
  if (!receiverContacts?.contacts.includes(senderId)) receiverContacts?.contacts.push(senderId);

  await senderContacts?.save();
  await receiverContacts?.save();
};

const getAllMessages = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;

  const chattedUser = await User.findById(id);
  if (!chattedUser) return res.status(404).json({ err: new ApiError("Chatted user not found", 404) });

  const messages = await Message.find({
    $or: [
      { to: chattedUser._id, from: user._id },
      { to: user._id, from: chattedUser._id },
    ]
  });

  return res.status(200).json({ msg: "Messages fetched successfully", messages });
});

const setMessagesStatus = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;

  const chattedUser = await User.findById(id);
  if (!chattedUser) return res.status(404).json({ err: new ApiError("Chatted user not found", 404) });

  await Message.updateMany({
    $or: [
      { to: chattedUser._id, from: user._id },
      { to: user._id, from: chattedUser._id },
    ]
  }, { isRead: true });

  return res.status(200).json({ msg: "Message status updated successfully" });
});

export { sendMessage, getAllMessages, setMessagesStatus };
