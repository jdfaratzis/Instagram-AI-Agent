const Logger = require('./Logger');
const fs = require('fs');
const path = require('path');

class Analytics {
    constructor() {
        this.metrics = {
            posts: {
                total: 0,
                byType: {},
                engagement: {}
            },
            engagement: {
                likes: 0,
                comments: 0,
                follows: 0,
                reach: 0
            },
            audience: {
                growth: 0,
                demographics: {}
            }
        };
        
        this.actionLog = [];
        this.logFile = path.join(__dirname, '../logs/actions.log');
        
        // Ensure logs directory exists
        if (!fs.existsSync(path.dirname(this.logFile))) {
            fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
        }
    }

    logAction(action) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action: action.type,
            details: action.details,
            target: action.target,
            success: action.success,
            metadata: action.metadata || {}
        };

        // Add to in-memory log
        this.actionLog.push(logEntry);
        
        // Append to log file
        fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
        
        // Update metrics based on action type
        this.updateMetrics(logEntry);
        
        Logger.info(`Logged action: ${action.type}`);
    }

    updateMetrics(logEntry) {
        switch (logEntry.action) {
            case 'like':
                this.metrics.engagement.likes++;
                break;
            case 'comment':
                this.metrics.engagement.comments++;
                break;
            case 'follow':
                this.metrics.engagement.follows++;
                break;
            case 'post':
                this.metrics.posts.total++;
                this.metrics.posts.byType[logEntry.details.type] = 
                    (this.metrics.posts.byType[logEntry.details.type] || 0) + 1;
                break;
            case 'edit':
                this.metrics.posts.edits = (this.metrics.posts.edits || 0) + 1;
                break;
            case 'share':
                this.metrics.engagement.shares = (this.metrics.engagement.shares || 0) + 1;
                break;
        }
    }

    getActionLog(filter = {}) {
        return this.actionLog.filter(entry => {
            return Object.entries(filter).every(([key, value]) => {
                return entry[key] === value;
            });
        });
    }

    generateDashboardData() {
        return {
            summary: {
                totalActions: this.actionLog.length,
                successfulActions: this.actionLog.filter(a => a.success).length,
                failedActions: this.actionLog.filter(a => !a.success).length,
                last24Hours: this.getActionLog({
                    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
                }).length
            },
            recentActions: this.actionLog.slice(-50).reverse(),
            metrics: this.metrics,
            actionBreakdown: this.getActionBreakdown(),
            timestamp: new Date().toISOString()
        };
    }

    getActionBreakdown() {
        const breakdown = {};
        this.actionLog.forEach(entry => {
            breakdown[entry.action] = (breakdown[entry.action] || 0) + 1;
        });
        return breakdown;
    }

    // Additional helper methods
    getPostHistory(postId) {
        return this.actionLog.filter(entry => 
            entry.target && entry.target.postId === postId
        );
    }

    getUserInteractions(username) {
        return this.actionLog.filter(entry => 
            entry.target && entry.target.username === username
        );
    }

    getTimeBasedStats(timeframe = '24h') {
        const now = new Date();
        let startTime;
        
        switch (timeframe) {
            case '24h':
                startTime = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = new Date(now - 24 * 60 * 60 * 1000);
        }

        return this.actionLog.filter(entry => 
            new Date(entry.timestamp) >= startTime
        );
    }
}

module.exports = new Analytics(); 