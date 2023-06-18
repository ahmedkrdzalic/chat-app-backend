const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user/User");
const { registrationValidation } = require("../services/Validations");

router.post("/registration", async (req, res) => {
  const data = req.body;

  //validating the registration data
  const validation_res = registrationValidation(data);
  console.log(validation_res);
  if (validation_res !== "valid") {
    return res.status(400).send(`ERROR: ${validation_res}`);
  }

  //hashing the password
  bcrypt.hash(data.password, 10).then(async (hash) => {
    let user_res;

    try {
      user_res = await User.create({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: hash,
      });

      if (user_res) {
        return res.status(200).send("SUCCESS");
      } else {
        return res.status(400).send(`ERROR: ${user_res}`);
      }
    } catch (error) {
      //duplicate key error
      if (error.code === 11000)
        return res.status(400).send(`ERROR: Email already exists`);
      else return res.status(400).send(`ERROR: ${user_res}`);
    }
  });
});

module.exports = router;
