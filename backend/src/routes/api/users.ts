import express, { RequestHandler } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../../controllers/userController";

const router = express.Router();
router.get("/", getAllUsers);
router.delete("/delete/:id", deleteUser as RequestHandler);
router.get("/:id", getUser as RequestHandler);
router.put("/update/:id", updateUser as RequestHandler);

export default router;
