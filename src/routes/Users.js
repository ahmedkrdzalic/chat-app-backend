const express = require("express");
const router = express.Router();
const User = require("../models/user/User");

router.get("/profile", async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId })
    .then(function (user) {
      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
      });
    })
    .catch(function (err) {
      // every error
      return res.json(err);
    });
});

module.exports = router;
