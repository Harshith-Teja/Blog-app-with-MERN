import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./src/middleware/logEvents";
import { errorHandler } from "./src/middleware/errorHandler";
import { verifyJWT } from "./src/middleware/verifyJWT";
import registerRouter from "./src/routes/register";
import loginRouter from "./src/routes/login";
import logoutRouter from "./src/routes/logout";
import refreshRouter from "./src/routes/refresh";
import googleRouter from "./src/routes/google";
import postsRouter from "./src/routes/posts";
import commentsRouter from "./src/routes/comment";
import userRouter from "./src/routes/api/users";
import { connectDB } from "./src/config/connectDB";
import cookieParser from "cookie-parser";
import corsOptions from "./src/config/corsOptions";
import credentials from "./src/middleware/credentials";

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

app.use(verifyJWT as RequestHandler);

app.use("/users", userRouter);
app.use("/posts", postsRouter);
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
