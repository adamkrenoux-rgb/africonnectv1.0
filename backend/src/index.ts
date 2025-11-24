import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.ts';
import listingsRouter from './routes/listings.ts';
import bookingsRouter from './routes/bookings.ts';
import campaignsRouter from './routes/campaigns.ts';
import applicationsRouter from './routes/applications.ts';
import verificationsRouter from './routes/verifications.ts';
import paymentsRouter from './routes/payments.ts';
import aiRouter from './routes/ai.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', usersRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/verifications', verificationsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/ai', aiRouter);

// Test route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Africonnect backend is running.' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Africonnect backend listening on port ${PORT}`);
});
