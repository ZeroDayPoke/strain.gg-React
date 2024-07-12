// userRoutes.ts

import express from "express";
import userController from "../controllers/UserController";
import {
  asyncErrorHandler,
  requireRole,
  checkAuthorizationHeader,
  ensureAuthenticated,
  validateSession,
  verifyToken,
} from "../middleware";

const router = express.Router();

// Public Routes
router.post("/signup", asyncErrorHandler(userController.signUp));
router.post("/login", asyncErrorHandler(userController.logIn));

// Middleware for subsequent routes
router.use(checkAuthorizationHeader);
router.use(verifyToken);
router.use(validateSession);
router.use(ensureAuthenticated);

// User Routes
router.post("/verify", asyncErrorHandler(userController.verify));
router.post(
  "/request-reset-password",
  asyncErrorHandler(userController.requestResetPassword)
);

router.post("/logout", asyncErrorHandler(userController.logOut));
router.get("/checkSession", asyncErrorHandler(userController.checkSession));

// Admin Routes
router.use(requireRole("Admin"));
router.get("/all", asyncErrorHandler(userController.getAllUsers));

export default router;
