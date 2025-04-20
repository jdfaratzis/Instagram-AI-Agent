import '@jest/globals';
import { Analytics } from '../utils/analytics';
import { ActionType } from '../types/analytics';

describe('Analytics', () => {
    let analytics: Analytics;

    beforeEach(() => {
        analytics = new Analytics();
    });

    describe('trackAction', () => {
        it('should track action counts correctly', () => {
            analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
            analytics.trackAction(ActionType.COMMENT, 'post1', 'user1');
            analytics.trackAction(ActionType.LIKE, 'post2', 'user2');

            const dashboardData = analytics.generateDashboardData();
            expect(dashboardData.totalActions).toBe(3);
            expect(dashboardData.actionBreakdown[ActionType.LIKE]).toBe(2);
            expect(dashboardData.actionBreakdown[ActionType.COMMENT]).toBe(1);
        });

        it('should track post history correctly', () => {
            analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
            analytics.trackAction(ActionType.COMMENT, 'post1', 'user1');

            const postHistory = analytics.getPostHistory('post1');
            expect(postHistory).toBeTruthy();
            expect(postHistory?.actions.get(ActionType.LIKE)).toBe(1);
            expect(postHistory?.actions.get(ActionType.COMMENT)).toBe(1);
        });

        it('should track user interactions correctly', () => {
            analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
            analytics.trackAction(ActionType.FOLLOW, undefined, 'user1');

            const userInteractions = analytics.getUserInteractions('user1');
            expect(userInteractions).toBeTruthy();
            expect(userInteractions?.actions.get(ActionType.LIKE)).toBe(1);
            expect(userInteractions?.actions.get(ActionType.FOLLOW)).toBe(1);
        });
    });

    describe('generateDashboardData', () => {
        beforeEach(() => {
            // Set up test data
            analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
            analytics.trackAction(ActionType.COMMENT, 'post1', 'user1');
            analytics.trackAction(ActionType.LIKE, 'post2', 'user2');
            analytics.trackAction(ActionType.FOLLOW, undefined, 'user2');
        });

        it('should generate correct total actions', () => {
            const data = analytics.generateDashboardData();
            expect(data.totalActions).toBe(4);
        });

        it('should generate correct action breakdown', () => {
            const data = analytics.generateDashboardData();
            expect(data.actionBreakdown[ActionType.LIKE]).toBe(2);
            expect(data.actionBreakdown[ActionType.COMMENT]).toBe(1);
            expect(data.actionBreakdown[ActionType.FOLLOW]).toBe(1);
        });

        it('should generate correct top posts', () => {
            const data = analytics.generateDashboardData();
            expect(data.topPosts.length).toBeGreaterThan(0);
            expect(data.topPosts[0].postId).toBe('post1'); // post1 has more actions
        });

        it('should generate correct top users', () => {
            const data = analytics.generateDashboardData();
            expect(data.topUsers.length).toBeGreaterThan(0);
            expect(data.topUsers[0].username).toBe('user1'); // user1 has more actions
        });
    });

    describe('getTimeBasedStats', () => {
        beforeEach(() => {
            // Set up test data with actions at different times
            analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
            analytics.trackAction(ActionType.COMMENT, 'post1', 'user1');
        });

        it('should return correct stats for 1h timeframe', () => {
            const stats = analytics.getTimeBasedStats('1h');
            expect(stats.timeframe).toBe('1h');
            expect(stats.stats[ActionType.LIKE]).toBe(1);
            expect(stats.stats[ActionType.COMMENT]).toBe(1);
        });

        it('should return correct stats for 24h timeframe', () => {
            const stats = analytics.getTimeBasedStats('24h');
            expect(stats.timeframe).toBe('24h');
            expect(stats.stats[ActionType.LIKE]).toBe(1);
            expect(stats.stats[ActionType.COMMENT]).toBe(1);
        });
    });
}); 