import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "../middleware/logEvents";
import { errorHandler } from "../middleware/errorHandler";

const app = express();
const PORT = 5000;

dotenv.config();

//middleware
app.use(logger);
app.use(cors());
app.use(express.json());

//routes

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
