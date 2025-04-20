export interface AgentConfig {
    personality: {
        tone: 'friendly' | 'professional' | 'casual';
        style: 'engaging' | 'concise' | 'detailed';
        emojiUsage: 'none' | 'minimal' | 'moderate' | 'frequent';
        responseLength: number;
        bannedTopics: string[];
        preferredTopics: string[];
        responseTemplates: string[];
    };
    interactionPatterns: {
        likes: {
            frequency: 'low' | 'moderate' | 'high';
            timing: 'random' | 'immediate' | 'delayed';
            targets: ('following' | 'hashtags' | 'explore')[];
        };
        comments: {
            frequency: 'low' | 'moderate' | 'high';
            style: 'short' | 'medium' | 'long';
            sentiment: 'positive' | 'neutral' | 'mixed';
        };
        follows: {
            frequency: 'low' | 'moderate' | 'high';
            criteria: ('similarInterests' | 'engagementRate' | 'followerCount')[];
        };
    };
    contentGeneration: {
        captionStyle: 'engaging' | 'informative' | 'casual';
        hashtagStrategy: 'relevant' | 'trending' | 'mixed';
        maxHashtags: number;
        emojiUsage: 'none' | 'minimal' | 'moderate' | 'frequent';
    };
    safetyRules: {
        maxActionsPerHour: number;
        minDelayBetweenActions: number;
        maxDelayBetweenActions: number;
        dailyLimits: {
            likes: number;
            comments: number;
            follows: number;
        };
    };
}

export interface AgentState {
    lastActionTime: number;
    actionCounts: {
        likes: number;
        comments: number;
        follows: number;
    };
    dailyStats: {
        likes: number;
        comments: number;
        follows: number;
    };
    hourlyStats: {
        likes: number;
        comments: number;
        follows: number;
    };
}

export interface AgentAction {
    type: 'like' | 'comment' | 'follow';
    targetId: string;
    timestamp: number;
    metadata?: Record<string, any>;
} 