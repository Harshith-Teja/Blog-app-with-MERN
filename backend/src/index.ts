import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./middleware/logEvents";
import { errorHandler } from "./middleware/errorHandler";
import { verifyJWT } from "./middleware/verifyJWT";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import refreshRouter from "./routes/refresh";
import googleRouter from "./routes/google";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comment";
import userRouter from "./routes/api/users";
import { connectDB } from "./config/connectDB";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions";
import credentials from "./middleware/credentials";

const app = express();
const PORT = 5000;

dotenv.config();

//middleware
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/google", googleRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

app.use("/posts", postsRouter);

app.use(verifyJWT as RequestHandler);

app.use("/users", userRouter);
app.use("/comments", commentsRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  res.type("txt").send("404 not found");
});

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
