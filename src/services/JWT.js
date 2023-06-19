const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  accessToken = sign(
    { email: user.email, _id: user._id },
    process.env.JWT_SECRET
  );

  return accessToken;
};

//middleware to validate token
const validateToken = (req, res, next) => {
  const token = req.cookies["token"];

  if (!token) return res.status(401).json({ error: "Unauthorized!" });

  try {
    const isValid = verify(token, process.env.JWT_SECRET);
    //isValid is now resolved in object where it has values from cookie like email and id, we can store that in the request object
    req.user = isValid;
    if (isValid) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = { createToken, validateToken };
