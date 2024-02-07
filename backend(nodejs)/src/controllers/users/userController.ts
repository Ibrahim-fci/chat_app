import expressAsyncHandler from "express-async-handler";
import User from "../../models/User";
import Message from "../../models/message";
import ApiError from "../../utils/Error";
import { encryptText, decryptText } from "../../utils/bcryptText";
import { generateAccessToken } from "../../utils/jwt";
import { Types } from "mongoose";

const getUser = async (email: String, id: String) => {
  try {
    return await User.findOne({ _id: id });
  } catch {
    return null;
  }
};

const signup = expressAsyncHandler(async (req: any, res: any) => {
  let { name, email, password } = req.body;
  password = await encryptText(password);

  const userExists = await User.findOne({ email: email });
  if (userExists)
    return res.status(400).json({ err: new ApiError("User already exists", 400) });

  const newUser = new User({ name, email, password });
  await newUser.save();

  const accessToken = await generateAccessToken({
    id: newUser._id,
    email: newUser.email,
  });

  return res.status(201).json({ msg: "User created successfully", token: accessToken });
});

const signin = expressAsyncHandler(async (req: any, res: any) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user || !(await decryptText(password, user.password)))
    return res.status(404).json({ err: new ApiError("Invalid email or password", 404) });

  const accessToken = await generateAccessToken({
    id: user._id,
    email: user.email,
  });

  return res.status(201).json({ token: accessToken });
});

const getAll = expressAsyncHandler(async (req: any, res: any) => {
  const users = await User.find();
  return res.status(200).json({ users });
});

const getOne = expressAsyncHandler(async (req: any, res: any) => {
  const user = req.user;
  delete user.password;
  return res.status(200).json({ user });
});

const getById = expressAsyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ err: new ApiError("User not found", 404) });
  return res.status(200).json({ user });
});

const getUserContactsAndLastMessage = expressAsyncHandler(async (req: any, res: any) => {
  const user = req.user;
  const lastMessages: any = []

  const userContacts = await User.findById(user._id).populate('contacts')

  if (!userContacts) return res.json({ contacts: [] })

  for (let contact of userContacts.contacts) {
    let lastMessage = await Message.findOne({
      $or: [
        { from: user._id, to: contact._id },
        { from: contact._id, to: user._id },
      ],
    }).sort({ created_at: -1 }).exec();

    let unreadMessages = await Message.find({ from: contact._id, to: user._id, isRead: false }).count()
    lastMessages.push({ contact, lastMessage, unreadMessages })
  }

  const sortedArrayDesc = lastMessages.sort(compareByCreatedAtDesc);

  return res.status(200).json({ contacts: sortedArrayDesc });
});

const search = expressAsyncHandler(async (req: any, res: any) => {
  const user = req.user;
  const { username, email, type } = req.query;
  let users = await User.find({
    $or: [
      { name: { $regex: username, $options: "i" } },
      { email: { $regex: email, $options: "i" } }
    ]
  }).select('-password -contacts');

  users = users.filter((u: any) => u._id.toString() !== user._id.toString());

  let temp = [];
  if (type === "contacts") {
    temp = users.filter(item => user.contacts.some((c: { toString: () => string; }) => c.toString() === item._id.toString()));
  } else {
    temp = users.filter(item => !user.contacts.some((c: { toString: () => string; }) => c.toString() === item._id.toString()));
  }

  return res.status(200).json({ users: temp });
});

const addToContacts = expressAsyncHandler(async (req: any, res: any) => {
  const user = req.user;
  const { id } = req.params;
  const contactUser = await User.findById(id);

  if (!contactUser) return res.status(404).json(new ApiError("User not found", 404));

  const isExisted = user.contacts.some((item: Types.ObjectId) => item.toString() == contactUser._id.toString())

  if (!isExisted) {
    user.contacts.push(contactUser._id)
    await user.save()
  } else {
    return res.status(400).json({ msg: "User already in your contacts" });
  }

  return res.status(200).json({ msg: "User added to your contacts" });
});

const compareByCreatedAtDesc = (a: any, b: any) => {
  return (new Date(b.lastMessage.created_at).getTime() as number) - (new Date(a.lastMessage.created_at).getTime() as number);
};

export { getUser, signup, signin, getAll, getOne, getUserContactsAndLastMessage, search, addToContacts, getById };
