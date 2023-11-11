// ./controllers/UserController.js

import { User } from "../models/index.js";
import TokenService from "../services/TokenService.js";
import UserService from "../services/UserService.js";
import { Strain } from "../models/index.js";
import { logger } from "../middleware/requestLogger.js";

export const signUp = async (req, res) => {
  try {
    logger.info("Creating user...");
    const user = await UserService.createUser(req.body);
    const roles = user.Roles ? user.Roles.map((role) => role.name) : [];
    const accessToken = TokenService.generateAccessToken(user.id, user.email);

    res.json({
      message: "User created",
      token: accessToken,
      roles,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    logger.error("Error creating user: " + err.toString());
    res.status(500).send("Server error");
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Attempting to log in user with email: ${email}`);
    const { user, accessToken } = await UserService.authenticate({
      email,
      password,
    });
    logger.info(`User roles: ${JSON.stringify(user.Roles)}`);
    const roles = user.Roles ? user.Roles.map((role) => role.name) : [];
    const id = user.id;

    const user_strains = await User.findByPk(id, {
      include: [
        {
          model: Strain,
          as: "favorites",
          through: {
            attributes: [],
          },
          attributes: ["id"],
        },
      ],
    });

    const favorites = user_strains.favorites.map((strain) => strain.id);

    logger.info(`User favorites: ${JSON.stringify(favorites)}`);
    res.json({
      message: "User logged in",
      token: accessToken,
      roles,
      id,
      email: user.email,
      favorites,
    });
  } catch (err) {
    logger.error("Error logging in user: " + err.toString());
    res.status(500).json({ message: "Server error", error: err.toString() });
  }
};

export const verify = async (req, res) => {
  try {
    const user = await UserService.verifyEmailToken(req.query.token);

    res.json({ message: "User verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.toString() });
  }
};

export const addFavoriteStrain = async (req, res, next) => {
  try {
    await UserService.addFavoriteStrain(req.params.userId, req.params.strainId);
    res.status(200).json({ message: "Strain added to favorites" });
  } catch (error) {
    next(error);
  }
};

export const removeFavoriteStrain = async (req, res, next) => {
  try {
    await UserService.removeFavoriteStrain(
      req.params.userId,
      req.params.strainId
    );
    res.status(200).json({ message: "Strain removed from favorites" });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteStrains = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Strain,
          as: "favorites",
          through: {
            attributes: [],
          },
          attributes: ["id"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Map over the favorites array and select only the IDs
    const favoriteIds = user.favorites.map((strain) => strain.id);

    res.json(favoriteIds);
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (req, res, next) => {
  try {
    console.log(req.body.email);
    await UserService.requestPasswordReset(req.body.email);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    console.log(req.params.token, req.body.password);
    await UserService.resetPassword(req.params.token, req.body.password);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const requestVerificationEmail = async (req, res, next) => {
  try {
    await UserService.requestEmailVerification(req.body.email);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await UserService.verifyEmail(req.params.token);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStrains = async (req, res) => {
  const userId = req.params.userId;
  const favoriteIds = req.body;

  try {
    logger.info(`Updating favorite strains for user with ID: ${userId}`);
    const user = await User.findByPk(userId);
    if (!user) {
      logger.error(`User with ID ${userId} not found`);
      return res.status(404).send({ message: "User not found" });
    }

    // Fetch all favorite strains for the user
    const currentFavorites = await user.getFavorites();

    // Convert strain instances to strain IDs
    const currentFavoriteIds = currentFavorites.map((strain) => strain.id);

    logger.info(req.body);

    // Find strains to add and to remove
    const strainsToAdd = favoriteIds.filter(
      (strainId) => !currentFavoriteIds.includes(strainId)
    );
    const strainsToRemove = currentFavoriteIds.filter(
      (strainId) => !favoriteIds.includes(strainId)
    );

    logger.info(`Strains to add: ${strainsToAdd}`);
    logger.info(`Strains to remove: ${strainsToRemove}`);

    // Fetch the strains instances for adding and removing
    const strainsToAddInstances = await Strain.findAll({
      where: { id: strainsToAdd },
    });
    const strainsToRemoveInstances = await Strain.findAll({
      where: { id: strainsToRemove },
    });

    // Add and remove the strains
    await user.addFavorites(strainsToAddInstances);
    await user.removeFavorites(strainsToRemoveInstances);

    res.send({ message: "Favorites updated successfully" });
  } catch (error) {
    logger.error("Error updating favorite strains: " + error.toString());
    res.status(500).send({ message: "Server error" });
  }
};
