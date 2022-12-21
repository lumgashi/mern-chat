const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();

const rooms = ["general", "tech", "finance", "crypto"];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
require("./config/connection");

const server = require("http").createServer(app);
const PORT = 5001;

app.use("/api/user/", userRoutes);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

//get all messages in a room
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

//sort all messages in a room by date
function sortRoomMessagesByDate(messages) {
  //lattest => newest
  return messages.sort(function (a, b) {
    //date=> e.g 11/02/2021
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");
    // date[2]=2021, date[1]=02, date[0]=11
    //year - month - day
    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

//socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    console.log(content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  app.delete("/api/user/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      // const user = await User.findById(_id);
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            status: "offline",
            newMessages: newMessages,
          },
        },
        { new: true }
      );
      //user.status = "offline";

      // user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

server.listen(PORT, () => {
  console.log(`connected to server on ${PORT}`);
});
