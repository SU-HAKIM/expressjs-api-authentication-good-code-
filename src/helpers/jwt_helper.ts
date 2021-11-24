import jwt from "jsonwebtoken";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

export const signAccessToken = async (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30m",
      issuer: "",
      audience: userId as string,
    };

    jwt.sign(payload, secret as string, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(new createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};
