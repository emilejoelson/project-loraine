const usermodel = require("../models/userModel");

const userSchemaMethod = (data) => {
  return new Promise((resolve, reject) => {
    const user = new usermodel.userSchema(data);

    user
      .validate()
      .then(() => resolve(user))
      .catch((error) => reject(error));
  });
};

module.exports = { userSchemaMethod };
