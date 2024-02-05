import User from "../../models/User";
import Message from "../../models/message";



import expressAsyncHandelar from "express-async-handler";
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

const signup = expressAsyncHandelar(async (req: any, res: any) => {
  let { name, email, password } = req.body;
  const user = await User.findOne({ email: email });
  password = await encryptText(password);
  if (user)
    return res.status(400).json({ err: new ApiError("user already existed before", 400) }); // @desc check if user existed before

  const newUser = new User({ name, email, password });
  await newUser.save();

  const accessToken = await generateAccessToken({
    id: newUser._id,
    email: newUser.email,
  });

  return res
    .status(201)
    .json({ msg: "userCreated successfully", token: accessToken });
});

const signin = expressAsyncHandelar(async (req: any, res: any) => {
  let { email, password } = req.body;

  // @desc get the user by its Id
  const user = await User.findOne({ email: email });

  if (!user || !(await decryptText(password, user.password)))
    return res.status(404).json({ err: new ApiError("Invalid email or password", 404) });

  // @desc generate access  token
  const accessToken = await generateAccessToken({
    id: user._id,
    email: user.email,
  });

  return res.status(201).json({ token: accessToken });
});


const getAll = expressAsyncHandelar(async (req: any, res: any) => {
  const users = await User.find();
  return res.status(200).json({ users });
});



const getOne = expressAsyncHandelar(async (req: any, res: any) => {
  const user = req.user;
  delete user.password;

  return res.status(200).json({ user });
});


const getById = expressAsyncHandelar(async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ err: new ApiError("user not found", 404) });
  return res.status(200).json({ user });
});


// get user contacts and the last message beteen them
const getUserContactsAndLastMessage = expressAsyncHandelar(async (req: any, res: any) => {
  const user = req.user;
  const lastMessages: any = []

  // Get user contacts
  const userContacts = await User.findById(user._id).populate('contacts')

  if (!userContacts) return res.json({ contacts: [] })

  // Get the last message between each contact

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

const search = expressAsyncHandelar(async (req: any, res: any) => {
  const user = req.user;
  const { username, email, type } = req.query
  let temp = []

  // make partial search on email or name
  let users = await User.find({
    $or: [
      {
        name: { $regex: username, $options: "i" }
      }, {
        email: { $regex: email, $options: "i" }
      }
    ]
  }).select('-password -contacts');

  users = users.filter((u: any) => u._id.toString() !== user._id.toString())


  if (type == "contacts") {
    temp = users.map(item => {
      if (user.contacts.filter((c: Types.ObjectId) => c.toString() === item._id.toString())) {
        return item
      }
    })
  } else {
    temp = users.map(item => {
      if (user.contacts.filter((c: Types.ObjectId) => c.toString() !== item.toString())) {
        return item
      }
    })
  }


  return res.status(200).json({ users: temp });
});


const addToContacts = expressAsyncHandelar(async (req: any, res: any) => {
  const user = req.user;
  const { id } = req.params

  // get the user
  const contactUser = await User.findById(id);
  if (!contactUser) return res.status(404).json(new ApiError("user Not found", 404));

  const isExisted = user.contacts.filter((item: Types.ObjectId) => item.toString() == contactUser._id.toString())


  if (isExisted.length == 0) {
    user.contacts.push(contactUser._id)
    await user.save()
  } else {


    return res.status(400).json({ msg: "user already in your contacts" });

  }







  return res.status(200).json({ msg: "user added to your contacts" });


});


const compareByCreatedAtDesc = (a: any, b: any) => {
  return (new Date(b.lastMessage.created_at).getTime() as number) - (new Date(a.lastMessage.created_at).getTime() as number);
};



export { getUser, signup, signin, getAll, getOne, getUserContactsAndLastMessage, search, addToContacts, getById };
