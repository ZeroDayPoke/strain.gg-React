// ./routes/userRoutes.js

import express from "express";
import * as userController from '../controllers/UserController.js';

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.get("/verify", userController.verify);
router.get("/all", userController.getAllUsers);
router.post("/:userId/favorites/:strainId", userController.addFavoriteStrain);
router.delete("/:userId/favorites/:strainId", userController.removeFavoriteStrain);
router.get('/:userId/favorites', userController.getFavoriteStrains);
router.put("/:userId/favorites", userController.updateFavoriteStrains);
router.post("/request-reset-password", userController.requestResetPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/request-verification-email", userController.requestVerificationEmail);
router.post("/verify-email/:token", userController.verifyEmail);

export default router;
