const express = require('express');
const router = express.Router();
const Analytics = require('../utils/analytics');

router.get('/dashboard', (req, res) => {
    try {
        const data = Analytics.generateDashboardData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/actions', (req, res) => {
    try {
        const { timeframe } = req.query;
        const actions = Analytics.getTimeBasedStats(timeframe);
        res.json(actions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/post/:postId', (req, res) => {
    try {
        const { postId } = req.params;
        const history = Analytics.getPostHistory(postId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/:username', (req, res) => {
    try {
        const { username } = req.params;
        const interactions = Analytics.getUserInteractions(username);
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 