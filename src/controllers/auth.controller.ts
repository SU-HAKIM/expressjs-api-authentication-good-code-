import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import User from "../models/user.model";

import { authSchema } from "../helpers/validationSchema";
import { signAccessToken } from "../helpers/jwt_helper";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    console.log(result);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw new createError.Conflict(
        `${result.email} is already been registered.`
      );

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(String(user._id));
    console.log("called");
    res.send({ accessToken });
  } catch (error: any) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw new createError.NotFound("User not registered✋.");
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw new createError.Unauthorized("Username/Password not valid");
    const accessToken = await signAccessToken(String(user._id));

    res.send({ accessToken });
  } catch (error: any) {
    if (error.isJoi === true)
      return next(new createError.BadRequest("Invalid username/password."));
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("logout router");
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("fresh-token router");
};
