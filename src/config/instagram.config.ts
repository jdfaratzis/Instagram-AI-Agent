import { InstagramConfig } from '../types/instagram';
import { secureConfig } from './secure.config';

const getInstagramConfig = (): InstagramConfig => {
    return {
        credentials: secureConfig.getCredentials(),
        rateLimit: {
            likesPerHour: parseInt(process.env.INSTAGRAM_LIKES_PER_HOUR || '30'),
            commentsPerHour: parseInt(process.env.INSTAGRAM_COMMENTS_PER_HOUR || '20'),
            followsPerHour: parseInt(process.env.INSTAGRAM_FOLLOWS_PER_HOUR || '10'),
            minDelayBetweenActions: parseInt(process.env.INSTAGRAM_MIN_DELAY || '5000'),
            maxDelayBetweenActions: parseInt(process.env.INSTAGRAM_MAX_DELAY || '10000')
        },
        hashtags: [
            '#photography',
            '#travel',
            '#food',
            '#lifestyle',
            '#art'
        ],
        targetAccounts: [],
        blacklist: []
    };
};

export const instagramConfig = {
    getConfig: getInstagramConfig
}; 