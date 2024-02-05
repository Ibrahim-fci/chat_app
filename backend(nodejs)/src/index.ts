import globalError from "./middlewares/gloabal-error";
import connectDB from "./utils/db-connection";

// @desc third party packages
import express from "express";
import AppServer from "./utils/appServer";
import SocketServer from "./utils/socketServer";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";

// @desc constants
const PORT = process.env.PORT;
const app = AppServer.getInstance().app;
const server = SocketServer.getInstance().server;
const io = SocketServer.getInstance().io;
const dbURL = process.env.DBURL ? process.env.DBURL : "";
const GLOBAL_DB_URL = process.env.GLOBAL_DB_URL ? process.env.GLOBAL_DB_URL : "";

// @desc Routers
import UserRouter from "./routes/user";
import MessageRouter from "./routes/message";

// @desc middlewares
app.use(cors({ origin: "*" }));
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "./views")));

// @desc Set Routers
app.use("/users", UserRouter);
app.use("/messages", MessageRouter);

// @desc socket connection
io.on("connection", (socket: any) => {
  console.log("a user connected");
  socket.on("message", (data: any) => {
    console.log(data);
  });

  socket.on("typing", (data: any) => {
    console.log(data);
    io.emit("typing", data);
  });

  socket.on("newMessage", (data: any) => {
    console.log(data);
  })

  socket.on("typing", (data: any) => {
    io.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });


  socket.emit("chatMessage", "Hi my frind")
});

// server.on("newMessage", (data: any) => {
//   console.log(data);

// })
// server.emit("newMessage", {
//   text: "hello",
// })






// @desc global error middeleware
app.use(globalError);

// @desc mongo db connection
connectDB(dbURL)

server.listen(PORT, () => {
  console.log(`app listining on port ${PORT}...`);
});
