const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./database/db.js");
const routUser = require("./routes/UserRouter.js");
const routAuth = require("./routes/AuthRouter.js");
const routRole = require("./routes/RoleRouter.js");
const routClient = require("./routes/clientRoutes.js");
const routProduit = require("./routes/produitRoutes.js");
const routCommand = require("./routes/commandeRoutes.js");
const routLigneCmd = require("./routes/ligneCmdRoutes.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.io = io;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: true,
    cookie: { sameSite: "None", secure: false },
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  req.app.io = io;
  next();
});

db()
  .then(() => console.log("Connected to MongoDB !!"))
  .catch((err) => console.error(err));

app.use(routUser);
app.use(routAuth);
app.use(routRole);
app.use(routClient);
app.use(routProduit);
app.use(routCommand);
app.use(routLigneCmd);

io.on("connection", (socket) => {
  console.log("A client connected");
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
  socket.on("notification", (data) => {
    console.log("Received notification:", data);
    io.emit("notification", data);
  });
});
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(
    __dirname,
    "client",
    "dist",
    "client",
    "browser"
  );

  app.use(
    express.static(staticPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
          res.set("Content-Type", "application/javascript");
        }
      },
    })
  );

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running");
  });
}
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
module.exports = app;
