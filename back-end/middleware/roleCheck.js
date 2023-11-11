// ./middleware/roleCheck.js
import UserService from "../services/UserService.js";

const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await UserService.getUserById(req.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const hasRequiredRole = user.Roles.some(
        (role) => role.name === requiredRole
      );

      if (!hasRequiredRole) {
        return res
          .status(403)
          .json({
            message: `Forbidden: you don't have the required ${requiredRole} role`,
          });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.toString() });
    }
  };
};

export default requireRole;
