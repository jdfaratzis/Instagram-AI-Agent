import { ActionType, PostHistory, UserInteraction, TimeBasedStats, HourlyStats, DashboardData } from '../../src/types/analytics';

export class Analytics {
    private postHistory: Map<string, PostHistory> = new Map();
    private userInteractions: Map<string, UserInteraction> = new Map();
    private timeBasedStats: TimeBasedStats = {};

    trackAction(action: ActionType, postId: string, userId: string, username: string): void {
        const timestamp = new Date();
        const hour = timestamp.getHours();

        // Update post history
        if (!this.postHistory.has(postId)) {
            this.postHistory.set(postId, {
                postId,
                likes: 0,
                comments: 0,
                engagement: 0,
                lastInteraction: timestamp
            });
        }

        const post = this.postHistory.get(postId)!;
        if (action === 'like') post.likes++;
        if (action === 'comment') post.comments++;
        post.engagement = post.likes + post.comments;
        post.lastInteraction = timestamp;

        // Update user interactions
        if (!this.userInteractions.has(userId)) {
            this.userInteractions.set(userId, {
                userId,
                username,
                actions: 0,
                lastInteraction: timestamp
            });
        }

        const user = this.userInteractions.get(userId)!;
        user.actions++;
        user.lastInteraction = timestamp;

        // Update time-based stats
        if (!this.timeBasedStats[hour]) {
            this.timeBasedStats[hour] = {
                like: 0,
                comment: 0,
                follow: 0,
                unfollow: 0
            };
        }

        this.timeBasedStats[hour][action]++;
    }

    generateDashboardData(): DashboardData {
        const totalActions = Array.from(this.userInteractions.values())
            .reduce((sum, user) => sum + user.actions, 0);

        const actionBreakdown: HourlyStats = {
            like: 0,
            comment: 0,
            follow: 0,
            unfollow: 0
        };

        Object.entries(this.timeBasedStats).forEach(([_, stats]) => {
            const hourStats = stats as HourlyStats;
            Object.keys(hourStats).forEach(action => {
                const actionType = action as ActionType;
                actionBreakdown[actionType] += hourStats[actionType];
            });
        });

        const hourlyStats = Object.entries(this.timeBasedStats).map(([hour, stats]) => {
            const hourlyStats = stats as HourlyStats;
            return {
                hour: parseInt(hour),
                like: hourlyStats.like,
                comment: hourlyStats.comment,
                follow: hourlyStats.follow,
                unfollow: hourlyStats.unfollow
            };
        });

        const topPosts = Array.from(this.postHistory.values())
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 5);

        const topUsers = Array.from(this.userInteractions.values())
            .sort((a, b) => b.actions - a.actions)
            .slice(0, 5);

        return {
            totalActions,
            actionBreakdown,
            hourlyStats,
            topPosts,
            topUsers
        };
    }

    getPostHistory(postId: string): PostHistory | null {
        return this.postHistory.get(postId) || null;
    }

    getUserInteractions(username: string): UserInteraction | null {
        return Array.from(this.userInteractions.values()).find(user => user.username === username) || null;
    }
} 