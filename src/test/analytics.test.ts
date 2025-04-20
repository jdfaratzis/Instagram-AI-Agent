import { Analytics } from '../utils/analytics';
import { ActionType } from '../types/analytics';

describe('Analytics', () => {
    let analytics: Analytics;

    beforeEach(() => {
        analytics = new Analytics();
    });

    test('should track actions correctly', () => {
        const postId = 'test_post_1';
        const userId = 'test_user_1';
        const username = 'testuser';

        // Track some actions
        analytics.trackAction('like', postId, userId, username);
        analytics.trackAction('comment', postId, userId, username);
        analytics.trackAction('follow', postId, userId, username);

        const dashboard = analytics.generateDashboardData();

        expect(dashboard.totalActions).toBe(3);
        expect(dashboard.actionBreakdown.like).toBe(1);
        expect(dashboard.actionBreakdown.comment).toBe(1);
        expect(dashboard.actionBreakdown.follow).toBe(1);
    });

    test('should calculate engagement correctly', () => {
        const postId = 'test_post_2';
        const userId = 'test_user_2';
        const username = 'testuser2';

        // Track multiple likes and comments
        for (let i = 0; i < 5; i++) {
            analytics.trackAction('like', postId, userId, username);
        }
        for (let i = 0; i < 2; i++) {
            analytics.trackAction('comment', postId, userId, username);
        }

        const dashboard = analytics.generateDashboardData();
        const post = dashboard.topPosts.find(p => p.postId === postId);

        expect(post?.engagement).toBe(7); // 5 likes + 2 comments
    });

    test('should maintain hourly stats', () => {
        const postId = 'test_post_3';
        const userId = 'test_user_3';
        const username = 'testuser3';
        const currentHour = new Date().getHours();

        analytics.trackAction('like', postId, userId, username);
        analytics.trackAction('comment', postId, userId, username);

        const dashboard = analytics.generateDashboardData();
        const hourlyStats = dashboard.hourlyStats.find(stats => stats.hour === currentHour);

        expect(hourlyStats).toBeDefined();
        expect(hourlyStats?.like).toBe(1);
        expect(hourlyStats?.comment).toBe(1);
    });
}); 