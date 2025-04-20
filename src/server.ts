import express from 'express';
import path from 'path';
import dashboardRouter from './api/dashboard';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

// API Routes
app.use('/api', dashboardRouter);

// Serve dashboard
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
