import User from "../../models/User";
import Message from "../../models/message";
import expressAsyncHandelar from "express-async-handler";
import ApiError from "../../utils/Error";
import { encryptText, decryptText } from "../../utils/bcryptText";
import { generateAccessToken } from "../../utils/jwt";


import SocketServer from "../../utils/socketServer";
const io = SocketServer.getInstance().io;
// const server = SocketServer.getInstance().server;

const sendMessage = expressAsyncHandelar(async (req: any, res: any) => {
  const { content, to } = req.body;
  const senderUser = req.user;

  // @desc check if reciver exists or not
  const reciver = await User.findById(to);
  if (!reciver)
    return res.status(404).json({ err: new ApiError("reciver not found", 404) });

  if (senderUser == reciver) return res.status(400).json({ err: new ApiError("you can't send message to yourself", 400) });

  const message = new Message({
    content,
    to: reciver._id,
    from: senderUser._id,
    isRead: false,
  });

  await message.save();
  // send prodcast  to all user 
  io.emit("newMessage", message);

  const senderContacts = await User.findById(senderUser._id);
  const reciverContacts = await User.findById(reciver._id);

  // check if user exist in contacts
  if (!senderContacts?.contacts.includes(reciver._id)) senderContacts?.contacts.push(reciver._id);
  if (!reciverContacts?.contacts.includes(senderUser._id)) reciverContacts?.contacts.push(senderUser._id);
  await senderContacts?.save();
  await reciverContacts?.save();

  return res.status(201).json({ msg: "message sent successfully", message });
});

const getAllMessages = expressAsyncHandelar(async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;

  // check if user with param id existes
  const chatedUser = await User.findById(id);
  if (!chatedUser) return res.status(404).json({ err: new ApiError("chated user no found", 404) });

  // get messgaes
  const messages = await Message.find({

    $or: [
      { to: chatedUser._id, from: user._id },
      { to: user._id, from: chatedUser._id },
    ]
  })

  return res.status(200).json({ msg: "messages fetched successfully", messages });

})

const setMessagesStatus = expressAsyncHandelar(async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user;

  // check if user with param id existes
  const chatedUser = await User.findById(id);
  if (!chatedUser) return res.status(404).json({ err: new ApiError("chated user no found", 404) });

  // get messgaes
  const messages = await Message.updateMany({
    $or: [
      { to: chatedUser._id, from: user._id },
      { to: user._id, from: chatedUser._id },
    ]
  }, { isRead: true })


  return res.status(200).json({ msg: "messages setatus set successfully" });

})

export { sendMessage, getAllMessages, setMessagesStatus };
