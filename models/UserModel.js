const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  civility: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    unique: true, 
    index: true  
  },
  telephone: { type: String, required: true },
});


const userSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    personalInfo: personalInfoSchema,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("users", userSchema);
module.exports = { User };
