const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.i3iyk4h.mongodb.net/project_loraine?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

const db = () => {
  return mongoose.connect(url);
};

module.exports = db;
