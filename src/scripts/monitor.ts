import { Analytics } from '../utils/analytics';
import { Logger } from '../utils/Logger';
import { HourlyStats } from '../types/analytics';

const analytics = new Analytics();
const logger = new Logger('Monitor');

async function monitorAgent() {
    try {
        const dashboardData = analytics.generateDashboardData();
        
        // Log summary
        logger.info('Agent Performance Summary', {
            totalActions: dashboardData.totalActions,
            actionBreakdown: dashboardData.actionBreakdown,
            topPosts: dashboardData.topPosts.length,
            topUsers: dashboardData.topUsers.length
        });

        // Log hourly stats
        dashboardData.hourlyStats.forEach((stats: HourlyStats & { hour: number }) => {
            logger.info(`Hour ${stats.hour} Stats`, {
                likes: stats.like,
                comments: stats.comment,
                follows: stats.follow,
                unfollows: stats.unfollow
            });
        });

        // Check for potential issues
        const failedActions = dashboardData.actionBreakdown.like + 
                            dashboardData.actionBreakdown.comment + 
                            dashboardData.actionBreakdown.follow + 
                            dashboardData.actionBreakdown.unfollow;
        
        if (failedActions > 0) {
            logger.warn('Failed actions detected', {
                count: failedActions
            });
        }

        // Check rate limits
        const totalActionsLastHour = dashboardData.hourlyStats
            .reduce((sum, stats) => sum + stats.like + stats.comment + stats.follow + stats.unfollow, 0);
        
        if (totalActionsLastHour > 30) {
            logger.warn('Rate limit warning: More than 30 actions in the last hour');
        }

    } catch (error) {
        logger.error('Error in monitoring', { error });
    }
}

// Run monitoring every 5 minutes
setInterval(monitorAgent, 5 * 60 * 1000);

// Initial run
monitorAgent();

logger.info('Monitoring started'); 