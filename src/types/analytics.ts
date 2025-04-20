export type ActionType = 'like' | 'comment' | 'follow';

export interface PostHistory {
    postId: string;
    actions: {
        type: ActionType;
        timestamp: number;
    }[];
}

export interface UserInteraction {
    userId: string;
    actions: {
        type: ActionType;
        timestamp: number;
    }[];
    lastInteraction: number;
}

export interface TimeBasedStats {
    hourly: {
        [hour: string]: {
            total: number;
            byType: {
                [key in ActionType]: number;
            };
        };
    };
}

export interface DashboardData {
    totalActions: number;
    actionBreakdown: {
        [key in ActionType]: number;
    };
    hourlyStats: {
        [hour: string]: {
            total: number;
            byType: {
                [key in ActionType]: number;
            };
        };
    };
    topPosts: {
        postId: string;
        totalActions: number;
    }[];
    topUsers: {
        userId: string;
        totalActions: number;
    }[];
} 