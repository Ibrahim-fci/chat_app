import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
let TOKEN_SECRET = process.env.TOKEN_SECRE
  ? process.env.TOKEN_SECRE
  : "yyyyyyyyyyyyyyyyyyyyyyyyyyyy";

const generateAccessToken = (param: any) => {
  //{ expiresIn: "1800s" }
  return jwt.sign(param, TOKEN_SECRET);
};

const verifyAccessToken = (token: any, res: any) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (e) {
    return res.status(401).send("unauthorized");
  }
};

const generateRefreshToken = (param: any) => {
  //{ expiresIn: "1800s" }
  return jwt.sign(param, TOKEN_SECRET);
};

const verifyRefreshToken = (token: any, res: any) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (e) {
    return res.status(401).send("unauthorized");
  }
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
