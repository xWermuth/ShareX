const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const morgan = require("morgan");
const Chat = require("./models/chat");
const { handleChatSocketIO } = require("./socketIO/chat.socketIO");

require("dotenv").config();
const password = process.env.SERVER_PASSWORD;
const connectionString =
  "mongodb+srv://admin:" +
  password +
  "@imgexdb-1ruqi.mongodb.net/test?retryWrites=true&w=majority";
const cors = require("cors");

const connect = mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("connected to database");
  }
);

handleChatSocketIO(io, connect);

app.use(morgan("dev"));

app.use(express.json());
app.use(cors());

server.listen(port, () => {
  console.log("server is running");
});

const verifyToken = require("./middleware/verifyToken");
app.get("/", verifyToken, (req, res) => {
  // @ts-ignore
  res.send(req.user);
});

app.use("/auth", require("./routes/authentication"));
app.use("/photos", require("./routes/photoRoutes"));
app.use("/screams", require("./routes/screamRoutes"));
app.use("/users", require("./routes/userInfoRoutes"));

app.use("/comments", require("./routes/commentRoutes"));
app.use("/likes", require("./routes/likeRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/search", require("./routes/searchUsersRoute"));
app.use("/chat", require("./routes//chatRoutes"));
app.use(require("./middleware/errorHandler"));
