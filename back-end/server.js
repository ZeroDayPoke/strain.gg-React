import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { errorHandler, logger, requestLogger } from './middleware/index.js';
import { UserRoutes, StrainRoutes, ReviewRoutes, StoreRoutes } from './routes/index.js';
import { User, Store, Strain, Review, Role, UserRole, db } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'development'
  ? '*'  // Allow all origins in development
  : ['https://strain.gg', 'http://localhost:5173'];  // Restrict origins in production

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(methodOverride());

app.use(requestLogger);

app.use('/users', UserRoutes);
app.use('/strains', StrainRoutes);
app.use('/reviews', ReviewRoutes);
app.use('/stores', StoreRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

db.authenticate()
  .then(() => logger.info('Database connected...'))
  .catch(err => logger.error('Error: ' + err));

db.sync()
  .then(() => logger.info('Tables created...'))
  .catch(err => logger.error('Error creating tables:', err));

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Server closed');
    db.close();
  });
});
