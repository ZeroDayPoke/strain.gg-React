// ./models/index.ts

import db from "../config/database";
import { setupAssociations } from "./associations";
setupAssociations();

import User from "./User";
import Role from "./Role";
import Token from "./Token";
import { UserRole } from "./associations";

export { db, Role, User, UserRole, Token };
