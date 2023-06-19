const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  accessToken = sign(
    { email: user.email, _id: user._id },
    process.env.JWT_SECRET
  );

  return accessToken;
};

module.exports = { createToken, validateToken };
