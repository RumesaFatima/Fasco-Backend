import jwt from "jsonwebtoken";

const generateToken = (user) => jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

export default generateToken;
