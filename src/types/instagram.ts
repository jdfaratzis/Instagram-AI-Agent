export interface InstagramPost {
    id: string;
    caption: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
    mediaUrl: string;
    timestamp: number;
    username: string;
    userId: string;
    likes: number;
    comments: number;
    hashtags: string[];
}

export interface InstagramUser {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    followers: number;
    following: number;
    posts: number;
    isPrivate: boolean;
    isVerified: boolean;
}

export interface InstagramComment {
    id: string;
    text: string;
    timestamp: number;
    username: string;
    userId: string;
}

export interface InstagramCredentials {
    username: string;
    password: string;
    sessionId?: string;
}

export interface InstagramConfig {
    credentials: InstagramCredentials;
    rateLimit: {
        likesPerHour: number;
        commentsPerHour: number;
        followsPerHour: number;
        minDelayBetweenActions: number;
        maxDelayBetweenActions: number;
    };
    hashtags: string[];
    targetAccounts: string[];
    blacklist: string[];
} 