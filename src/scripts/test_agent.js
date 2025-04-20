const InstagramAgent = require('../Agent/InstagramAgent');
const Logger = require('../utils/Logger');

async function testAgent() {
    try {
        Logger.info('Starting Instagram AI Agent test...');
        
        // Initialize the agent
        const agent = new InstagramAgent();
        
        // Test 1: Login
        Logger.info('Testing login...');
        const loginSuccess = await agent.login();
        if (!loginSuccess) {
            throw new Error('Login failed');
        }
        
        // Test 2: Content Generation
        Logger.info('Testing content generation...');
        const testPost = await agent.generatePost({
            type: 'image',
            theme: 'My Story, Unfiltered'
        });
        
        // Test 3: Engagement
        Logger.info('Testing engagement...');
        const testComment = await agent.generateComment({
            postType: 'cancer_awareness',
            sentiment: 'supportive'
        });
        
        // Test 4: Analytics
        Logger.info('Testing analytics...');
        const metrics = await agent.getMetrics();
        
        Logger.info('All tests completed successfully!');
        return {
            success: true,
            metrics
        };
    } catch (error) {
        Logger.error('Test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the tests
testAgent().then(result => {
    if (result.success) {
        Logger.info('Test results:', result.metrics);
    } else {
        Logger.error('Test failed:', result.error);
    }
}); 