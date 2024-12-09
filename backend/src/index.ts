import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = 5000;

dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

//routes

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
