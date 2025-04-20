# Instagram AI Agent

An intelligent Instagram automation and analytics system that helps manage and track Instagram interactions with a real-time dashboard.

## Features

- 🤖 Automated Instagram interactions (likes, comments, follows)
- 📊 Real-time analytics dashboard
- 📈 Action tracking and engagement metrics
- ⏱️ Time-based statistics
- 🔒 Safe interaction limits and delays
- 📝 Detailed logging system

## Security

### Credential Safety
- Never commit your `.env` file to version control
- Use `.env.example` as a template for required environment variables
- Keep your credentials secure and never share them
- Use strong, unique passwords for your Instagram account
- Enable two-factor authentication on your Instagram account

### Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```
# Instagram Credentials
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password

# Server Configuration
PORT=3000
LOG_LEVEL=info

# Security
SESSION_SECRET=your_session_secret_key
ENCRYPTION_KEY=your_encryption_key

# Rate Limiting
MAX_ACTIONS_PER_HOUR=30
MIN_ACTION_DELAY=5000
MAX_ACTION_DELAY=10000

# Daily Limits
MAX_LIKES_PER_DAY=100
MAX_COMMENTS_PER_DAY=20
MAX_FOLLOWS_PER_DAY=10
```

### Best Practices
1. **Credential Management**
   - Use environment variables for all sensitive data
   - Never hardcode credentials in the source code
   - Rotate credentials regularly
   - Use different credentials for development and production

2. **Access Control**
   - Limit dashboard access to trusted IPs
   - Use strong passwords for dashboard access
   - Implement rate limiting for API endpoints
   - Monitor for suspicious activity

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement proper session management
   - Regularly audit access logs

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Instagram account credentials
- Basic understanding of TypeScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/instagram-ai-agent.git
cd instagram-ai-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
PORT=3000
LOG_LEVEL=info
```

## Project Structure

```
instagram-ai-agent/
├── src/
│   ├── Agent/              # AI agent implementation
│   ├── api/                # API endpoints
│   ├── dashboard/          # Dashboard UI
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── server.ts           # Main server file
├── logs/                   # Application logs
├── build/                  # Compiled JavaScript
└── test/                   # Test files
```

## Usage

### Starting the Server

1. Development mode (with hot reload):
```bash
npm run dev
```

2. Production mode:
```bash
npm start
```

The dashboard will be available at `http://localhost:3000`

### Using the AI Agent

The AI agent automatically tracks and performs actions based on the configuration in `src/Agent/training/instagram_training_data.json`. You can modify these settings to customize the agent's behavior.

### Dashboard Features

1. **Summary Cards**
   - Total Actions
   - Successful Actions
   - Failed Actions
   - Last 24 Hours Activity

2. **Charts**
   - Action Breakdown (Pie Chart)
   - Engagement Metrics (Bar Chart)

3. **Recent Actions Table**
   - Time of action
   - Action type
   - Target
   - Status
   - Details

4. **Time Filters**
   - Last 24 Hours
   - Last 7 Days
   - Last 30 Days

### API Endpoints

- `GET /api/dashboard` - Get all dashboard data
- `GET /api/actions?timeframe=24h` - Get time-based action statistics
- `GET /api/post/:postId` - Get post history
- `GET /api/user/:username` - Get user interactions

## Deployment

### Production Deployment

1. Build the project:
```bash
npm run build
```

2. Install PM2 globally:
```bash
npm install -g pm2
```

3. Start the application with PM2:
```bash
pm2 start build/server.js --name instagram-ai-agent
```

4. Set up PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

### Monitoring

1. View logs:
```bash
pm2 logs instagram-ai-agent
```

2. Monitor application:
```bash
npm run monitor
```

3. Stop the agent:
```bash
pm2 stop instagram-ai-agent
```

4. Restart the agent:
```bash
pm2 restart instagram-ai-agent
```

## Analytics Tracking

The system tracks the following metrics:

1. **Action Statistics**
   - Total actions performed
   - Action types (like, comment, follow, unfollow)
   - Success/failure rates
   - Time-based distribution

2. **Engagement Metrics**
   - Likes per post
   - Comments per post
   - Follow/unfollow ratios
   - Engagement rates

3. **User Interactions**
   - User activity history
   - Interaction patterns
   - Time-based user engagement

4. **Post History**
   - Post engagement
   - Action timestamps
   - Interaction details

## Safety and Limits

The agent includes built-in safety measures:

1. **Rate Limiting**
   - Maximum 30 actions per hour
   - Minimum 5 seconds delay between actions
   - Maximum 10 seconds delay between actions

2. **Daily Limits**
   - 100 likes per day
   - 20 comments per day
   - 10 follows per day

3. **Content Restrictions**
   - Banned topics (politics, religion, etc.)
   - Spam prevention
   - Safe interaction patterns

## Troubleshooting

1. **Common Issues**
   - Instagram login failures
   - Rate limiting
   - Connection issues

2. **Logs**
   - Check `logs/` directory for detailed logs
   - Use `npm run monitor` for real-time monitoring

3. **Support**
   - Check the documentation
   - Open an issue on GitHub
   - Contact support team

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for visualization
- Winston for logging
- Express for the server
- TypeScript for type safety
