import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./src/middleware/logEvents";
import { errorHandler } from "./src/middleware/errorHandler";
import { verifyJWT } from "./src/middleware/verifyJWT";
import registerRouter from "./src/routes/register";
import loginRouter from "./src/routes/login";
import userRouter from "./src/routes/api/users";
import { connectDB } from "./src/config/connectDB";

const app = express();
const PORT = 5000;

dotenv.config();

//middleware
app.use(logger);
app.use(cors());
app.use(express.json());

//routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.use(verifyJWT as RequestHandler);

app.use("/users", userRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  res.type("txt").send("404 not found");
});

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
