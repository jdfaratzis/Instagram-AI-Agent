import { Router } from 'express';
import { Analytics } from '../utils/analytics';

const router = Router();
const analytics = new Analytics();

// Get dashboard data
router.get('/dashboard', (_req, res) => {
    try {
        const dashboardData = analytics.generateDashboardData();
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate dashboard data' });
    }
});

// Get time-based action statistics
router.get('/actions', (req, res) => {
    try {
        const timeframe = req.query.timeframe as string || '24h';
        const stats = analytics.getTimeBasedStats(timeframe);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get action statistics' });
    }
});

// Get post history
router.get('/post/:postId', (req, res) => {
    try {
        const { postId } = req.params;
        const history = analytics.getPostHistory(postId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get post history' });
    }
});

// Get user interactions
router.get('/user/:username', (req, res) => {
    try {
        const { username } = req.params;
        const interactions = analytics.getUserInteractions(username);
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user interactions' });
    }
});

export default router; 