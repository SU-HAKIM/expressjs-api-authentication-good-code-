import morgan from "morgan";
import createError from "http-errors";
import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
  urlencoded,
} from "express";

import AuthRoute from "./routers/auth.route";

import "./helpers/init_mongodb";

dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from express");
});

app.use("/auth", AuthRoute);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
