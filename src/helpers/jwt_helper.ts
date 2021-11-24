import jwt, { JwtPayload } from "jsonwebtoken";
import createError from "http-errors";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

type Req<T> = T & { payload: JwtPayload | undefined };

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

export const verifyAccessToken = (
  req: Req<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["authorization"])
      return next(new createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, payload) => {
        if (err) return next(new createError.Unauthorized());
        req.payload = payload;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};
