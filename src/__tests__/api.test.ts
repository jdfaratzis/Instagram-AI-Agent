import '@jest/globals';
import request from 'supertest';
import express from 'express';
import dashboardRouter from '../api/dashboard';
import { Analytics } from '../utils/analytics';
import { ActionType } from '../types/analytics';

describe('API Endpoints', () => {
    let app: express.Application;
    let analytics: Analytics;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api', dashboardRouter);
        
        // Reset analytics instance and add some test data
        analytics = new Analytics();
        analytics.trackAction(ActionType.LIKE, 'post1', 'user1');
        analytics.trackAction(ActionType.COMMENT, 'post1', 'user1');
        analytics.trackAction(ActionType.LIKE, 'post2', 'user2');
    });

    describe('GET /api/dashboard', () => {
        it('should return dashboard data', async () => {
            const response = await request(app)
                .get('/api/dashboard')
                .expect(200);

            expect(response.body).toHaveProperty('totalActions');
            expect(response.body).toHaveProperty('actionBreakdown');
            expect(response.body).toHaveProperty('hourlyStats');
            expect(response.body).toHaveProperty('topPosts');
            expect(response.body).toHaveProperty('topUsers');
            
            expect(response.body.totalActions).toBe(3);
            expect(response.body.actionBreakdown[ActionType.LIKE]).toBe(2);
            expect(response.body.actionBreakdown[ActionType.COMMENT]).toBe(1);
        });
    });

    describe('GET /api/actions', () => {
        it('should return time-based stats for 24h by default', async () => {
            const response = await request(app)
                .get('/api/actions')
                .expect(200);

            expect(response.body).toHaveProperty('timeframe');
            expect(response.body).toHaveProperty('stats');
            expect(response.body.timeframe).toBe('24h');
        });

        it('should return time-based stats for specified timeframe', async () => {
            const response = await request(app)
                .get('/api/actions?timeframe=1h')
                .expect(200);

            expect(response.body).toHaveProperty('timeframe');
            expect(response.body).toHaveProperty('stats');
            expect(response.body.timeframe).toBe('1h');
        });
    });

    describe('GET /api/post/:postId', () => {
        it('should return post history for existing post', async () => {
            const response = await request(app)
                .get('/api/post/post1')
                .expect(200);

            expect(response.body).toHaveProperty('postId');
            expect(response.body).toHaveProperty('actions');
            expect(response.body.postId).toBe('post1');
        });

        it('should return 404 for non-existing post', async () => {
            await request(app)
                .get('/api/post/nonexistent')
                .expect(404);
        });
    });

    describe('GET /api/user/:username', () => {
        it('should return user interactions for existing user', async () => {
            const response = await request(app)
                .get('/api/user/user1')
                .expect(200);

            expect(response.body).toHaveProperty('username');
            expect(response.body).toHaveProperty('actions');
            expect(response.body.username).toBe('user1');
        });

        it('should return 404 for non-existing user', async () => {
            await request(app)
                .get('/api/user/nonexistent')
                .expect(404);
        });
    });
}); 