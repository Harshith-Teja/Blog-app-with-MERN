import express, { RequestHandler } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
} from "../../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.delete("/", deleteUser as RequestHandler);
router.get("/:id", getUser as RequestHandler);

export default router;
