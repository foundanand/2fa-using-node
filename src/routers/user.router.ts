import { Express } from "express";
import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

// Create a new user
router.post("/createUser", userController.createUser);

// Login a user
router.post("/login", userController.LoginUser);

export { router };
