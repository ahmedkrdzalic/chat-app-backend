const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user/User");
const { registrationValidation } = require("../services/Validations");
const { createToken, validateToken } = require("../services/JWT");

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
        return res.status(200).json("SUCCESS");
      } else {
        return res.status(400).json({ error: `ERROR: ${user_res}` });
      }
    } catch (error) {
      //duplicate key error
      if (error.code === 11000)
        return res.status(400).json({ error: `ERROR: Email already exists` });
      else return res.status(400).json({ error: `ERROR: ${user_res}` });
    }
  });
});

router.post("/login", async (req, res) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User does not exist!" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res
        .status(400)
        .json({ error: "Wrong username and password combination!" });
    } else {
      const accessToken = createToken(user);

      //30 days
      return res
        .cookie("token", accessToken, {
          maxAge: 2592000000,
          sameSite: "none",
        })
        .json({ user: { email: user.email, _id: user._id } });
    }
  });
});

router.get("/logout", validateToken, async (req, res) => {
  const token = req.cookies["token"];

  res
    .cookie("token", token, {
      maxAge: -1000,
      httpOnly: true,
    })
    .status(200)
    .json({ msg: "logout success" });
});

module.exports = router;
