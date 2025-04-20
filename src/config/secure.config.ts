import { InstagramCredentials } from '../types/instagram';

// Get credentials from environment variables
const getCredentials = (): InstagramCredentials => {
    const username = process.env.INSTAGRAM_USERNAME;
    const password = process.env.INSTAGRAM_PASSWORD;
    const sessionId = process.env.INSTAGRAM_SESSION_ID;

    if (!username || !password) {
        throw new Error('Instagram credentials not found in environment variables');
    }

    return {
        username,
        password,
        sessionId
    };
};

export const secureConfig = {
    getCredentials
}; 