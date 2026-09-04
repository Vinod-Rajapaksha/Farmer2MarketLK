import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import produceRoutes from './routes/produceRoutes';
import aiRoutes from './routes/aiRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
  res.send('Farmer2MarketLK API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
