import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { Browser, Page } from 'puppeteer';
import { Logger } from '../utils/Logger';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CharacterManager } from '../Agent/CharacterManager';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

export class InstagramService {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private isLoggedIn: boolean = false;
    private genAI: GoogleGenerativeAI;
    private cookiesPath: string;
    private proxyUrl?: string;
    private characterManager: CharacterManager;
    private interactionCount: number = 0;
    private lastInteractionTime: number = Date.now();

    constructor(proxyUrl?: string, characterName: string = 'default') {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
        this.cookiesPath = path.join(process.cwd(), 'cookies', 'instagram-cookies.json');
        this.proxyUrl = proxyUrl;
        this.characterManager = new CharacterManager(characterName);
        this.initialize();
    }

    private async initialize() {
        try {
            const launchOptions: any = {
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu'
                ]
            };

            if (this.proxyUrl) {
                launchOptions.args.push(`--proxy-server=${this.proxyUrl}`);
            }

            this.browser = await puppeteer.launch(launchOptions);
            this.page = await this.browser.newPage();
            await this.page.setViewport({ width: 1280, height: 800 });
            
            // Load cookies if they exist
            await this.loadCookies();
            
            Logger.info('Instagram service initialized');
        } catch (error) {
            Logger.error('Failed to initialize Instagram service:', error);
            throw error;
        }
    }

    private async loadCookies() {
        try {
            if (fs.existsSync(this.cookiesPath)) {
                const cookiesString = fs.readFileSync(this.cookiesPath, 'utf8');
                const cookies = JSON.parse(cookiesString);
                await this.page?.setCookie(...cookies);
                Logger.info('Cookies loaded successfully');
            }
        } catch (error) {
            Logger.error('Error loading cookies:', error);
        }
    }

    private async saveCookies() {
        try {
            const cookies = await this.page?.cookies();
            if (cookies) {
                const cookiesDir = path.dirname(this.cookiesPath);
                if (!fs.existsSync(cookiesDir)) {
                    fs.mkdirSync(cookiesDir, { recursive: true });
                }
                fs.writeFileSync(this.cookiesPath, JSON.stringify(cookies, null, 2));
                Logger.info('Cookies saved successfully');
            }
        } catch (error) {
            Logger.error('Error saving cookies:', error);
        }
    }

    public async login(username: string, password: string): Promise<boolean> {
        if (!this.page) {
            throw new Error('Instagram service not initialized');
        }

        try {
            await this.page.goto('https://www.instagram.com/accounts/login/');
            await this.page.waitForSelector('input[name="username"]');
            
            // Enter credentials
            await this.page.type('input[name="username"]', username);
            await this.page.type('input[name="password"]', password);
            
            // Click login button
            await this.page.click('button[type="submit"]');
            
            // Wait for navigation and check if login was successful
            await this.page.waitForNavigation();
            this.isLoggedIn = !(await this.page.$('input[name="username"]'));
            
            if (this.isLoggedIn) {
                await this.saveCookies();
                Logger.info('Successfully logged in to Instagram');
                return true;
            } else {
                Logger.error('Failed to log in to Instagram');
                return false;
            }
        } catch (error) {
            Logger.error('Error during Instagram login:', error);
            return false;
        }
    }

    public async generateCaption(imagePath: string): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            const imageData = fs.readFileSync(imagePath);
            const imageBase64 = imageData.toString('base64');
            
            const result = await model.generateContent([
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: 'image/jpeg'
                    }
                },
                "Generate an engaging Instagram caption for this image. Make it creative and relevant."
            ]);
            
            const response = await result.response;
            return response.text();
        } catch (error) {
            Logger.error('Error generating caption:', error);
            return 'Check out this post!';
        }
    }

    public async likePost(postUrl: string): Promise<boolean> {
        if (!this.page || !this.isLoggedIn) {
            throw new Error('Not logged in to Instagram');
        }

        try {
            await this.checkRateLimit();
            
            await this.page.goto(postUrl);
            await this.page.waitForSelector('svg[aria-label="Like"]');
            
            // Click like button
            await this.page.click('svg[aria-label="Like"]');
            
            this.incrementInteractionCount();
            Logger.info('Successfully liked post');
            return true;
        } catch (error) {
            Logger.error('Error liking post:', error);
            return false;
        }
    }

    public async commentOnPost(postUrl: string, comment?: string): Promise<boolean> {
        if (!this.page || !this.isLoggedIn) {
            throw new Error('Not logged in to Instagram');
        }

        try {
            await this.checkRateLimit();
            
            await this.page.goto(postUrl);
            await this.page.waitForSelector('textarea[aria-label="Add a comment…"]');
            
            // Generate comment if not provided
            const finalComment = comment || this.characterManager.getRandomResponseTemplate();
            
            // Type comment
            await this.page.type('textarea[aria-label="Add a comment…"]', finalComment);
            
            // Submit comment
            await this.page.keyboard.press('Enter');
            
            this.incrementInteractionCount();
            Logger.info('Successfully commented on post');
            return true;
        } catch (error) {
            Logger.error('Error commenting on post:', error);
            return false;
        }
    }

    public async followUser(username: string): Promise<boolean> {
        if (!this.page || !this.isLoggedIn) {
            throw new Error('Not logged in to Instagram');
        }

        try {
            await this.checkRateLimit();
            
            await this.page.goto(`https://www.instagram.com/${username}/`);
            await this.page.waitForSelector('button:has-text("Follow")');
            
            // Click follow button
            await this.page.click('button:has-text("Follow")');
            
            this.incrementInteractionCount();
            Logger.info(`Successfully followed user: ${username}`);
            return true;
        } catch (error) {
            Logger.error('Error following user:', error);
            return false;
        }
    }

    private async checkRateLimit() {
        const rules = this.characterManager.getInteractionRules();
        const now = Date.now();
        
        // Check hourly rate limit
        if (this.interactionCount >= rules.maxLikesPerHour && 
            now - this.lastInteractionTime < 3600000) {
            const waitTime = 3600000 - (now - this.lastInteractionTime);
            Logger.warn(`Rate limit reached. Waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.interactionCount = 0;
        }
        
        // Add random delay between actions
        const delay = this.characterManager.getRandomDelay();
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    private incrementInteractionCount() {
        this.interactionCount++;
        this.lastInteractionTime = Date.now();
    }

    public async postImage(imagePath: string, caption?: string): Promise<boolean> {
        if (!this.page || !this.isLoggedIn) {
            throw new Error('Not logged in to Instagram');
        }

        try {
            await this.checkRateLimit();
            
            // Generate caption if not provided
            let finalCaption = caption || await this.generateCaption(imagePath);
            
            // Add hashtags
            const hashtags = this.characterManager.getRandomHashtags(5);
            finalCaption += '\n\n' + hashtags.join(' ');
            
            await this.page.goto('https://www.instagram.com/');
            await this.page.waitForSelector('svg[aria-label="New post"]');
            
            // Click new post button
            await this.page.click('svg[aria-label="New post"]');
            
            // Upload image
            const fileInput = await this.page.waitForSelector('input[type="file"]');
            await fileInput?.uploadFile(imagePath);
            
            // Wait for image to upload and click next
            await this.page.waitForSelector('svg[aria-label="Next"]');
            await this.page.click('svg[aria-label="Next"]');
            
            // Add caption
            await this.page.waitForSelector('textarea[aria-label="Write a caption..."]');
            await this.page.type('textarea[aria-label="Write a caption..."]', finalCaption);
            
            // Share post
            await this.page.click('button[type="button"]');
            
            this.incrementInteractionCount();
            Logger.info('Successfully posted image to Instagram');
            return true;
        } catch (error) {
            Logger.error('Error posting image to Instagram:', error);
            return false;
        }
    }

    public async close(): Promise<void> {
        if (this.browser) {
            await this.saveCookies();
            await this.browser.close();
            this.browser = null;
            this.page = null;
            this.isLoggedIn = false;
            Logger.info('Instagram service closed');
        }
    }
} 