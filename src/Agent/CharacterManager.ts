import fs from 'fs';
import path from 'path';
import { Logger } from '../Utils/Logger';

interface Personality {
    tone: string;
    style: string;
    emojiUsage: string;
    responseLength: number;
    bannedTopics: string[];
    preferredTopics: string[];
    responseTemplates: string[];
}

interface InteractionRules {
    maxPostsPerDay: number;
    minDelayBetweenActions: number;
    maxDelayBetweenActions: number;
    maxCommentsPerPost: number;
    maxLikesPerHour: number;
}

interface ContentPreferences {
    preferredHashtags: string[];
    maxHashtagsPerPost: number;
    captionStyle: string;
    useEmojis: boolean;
    maxEmojisPerCaption: number;
}

interface CharacterConfig {
    name: string;
    personality: Personality;
    interactionRules: InteractionRules;
    contentPreferences: ContentPreferences;
}

export class CharacterManager {
    private currentCharacter: CharacterConfig;
    private charactersPath: string;

    constructor(characterName: string = 'default') {
        this.charactersPath = path.join(process.cwd(), 'src', 'Agent', 'characters');
        this.currentCharacter = this.loadCharacter(characterName);
    }

    private loadCharacter(characterName: string): CharacterConfig {
        try {
            const characterPath = path.join(this.charactersPath, `${characterName}.json`);
            if (!fs.existsSync(characterPath)) {
                Logger.warn(`Character ${characterName} not found, using default`);
                return this.loadCharacter('default');
            }

            const characterData = fs.readFileSync(characterPath, 'utf8');
            return JSON.parse(characterData);
        } catch (error) {
            Logger.error('Error loading character:', error);
            throw error;
        }
    }

    public getPersonality(): Personality {
        return this.currentCharacter.personality;
    }

    public getInteractionRules(): InteractionRules {
        return this.currentCharacter.interactionRules;
    }

    public getContentPreferences(): ContentPreferences {
        return this.currentCharacter.contentPreferences;
    }

    public getRandomResponseTemplate(): string {
        const templates = this.currentCharacter.personality.responseTemplates;
        return templates[Math.floor(Math.random() * templates.length)];
    }

    public getRandomDelay(): number {
        const { minDelayBetweenActions, maxDelayBetweenActions } = this.currentCharacter.interactionRules;
        return Math.floor(Math.random() * (maxDelayBetweenActions - minDelayBetweenActions + 1)) + minDelayBetweenActions;
    }

    public isTopicAllowed(topic: string): boolean {
        const { bannedTopics, preferredTopics } = this.currentCharacter.personality;
        return !bannedTopics.includes(topic) && preferredTopics.includes(topic);
    }

    public getRandomHashtags(count: number): string[] {
        const { preferredHashtags, maxHashtagsPerPost } = this.currentCharacter.contentPreferences;
        const availableHashtags = [...preferredHashtags];
        const selectedHashtags: string[] = [];
        
        count = Math.min(count, maxHashtagsPerPost);
        
        while (selectedHashtags.length < count && availableHashtags.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableHashtags.length);
            selectedHashtags.push(availableHashtags[randomIndex]);
            availableHashtags.splice(randomIndex, 1);
        }
        
        return selectedHashtags;
    }
} 