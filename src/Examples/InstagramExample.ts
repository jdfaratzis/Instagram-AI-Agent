import { InstagramService } from '../services/InstagramService';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Initialize with proxy if available
    const proxyUrl = process.env.INSTAGRAM_PROXY_URL;
    const instagram = new InstagramService(proxyUrl);
    
    try {
        // Login to Instagram
        const username = process.env.INSTAGRAM_USERNAME;
        const password = process.env.INSTAGRAM_PASSWORD;
        
        if (!username || !password) {
            throw new Error('Instagram credentials not found in environment variables');
        }
        
        const loggedIn = await instagram.login(username, password);
        if (!loggedIn) {
            throw new Error('Failed to log in to Instagram');
        }
        
        // Post an image with AI-generated caption
        const imagePath = './path/to/your/image.jpg';
        
        // Option 1: Let the AI generate the caption
        const posted = await instagram.postImage(imagePath);
        
        // Option 2: Provide your own caption
        // const posted = await instagram.postImage(imagePath, 'Your custom caption here');
        
        if (!posted) {
            throw new Error('Failed to post image to Instagram');
        }
        
        console.log('Successfully posted to Instagram!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Always close the browser when done
        await instagram.close();
    }
}

main().catch(console.error); 