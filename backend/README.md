# Backend API

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here

# Server Configuration
PORT=5001

# CORS Configuration
# Comma-separated list of allowed origins for CORS
# For development, use: http://localhost:3000,http://localhost:3001
# For production, add your production domain(s)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

## CORS Configuration

The API is configured with secure CORS settings that:

- Only allow requests from specified domains
- Support multiple origins for multi-profile/community features
- Include credentials support for authenticated requests
- Allow common HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- Support custom headers for user and profile identification

### Development Setup

For local development, the default allowed origins are:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

### Production Setup

For production, set the `ALLOWED_ORIGINS` environment variable with your production domains:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://app1.yourdomain.com,https://app2.yourdomain.com
```

This is especially important for a social media platform where creators can have their own communities/apps, as each may need its own subdomain.

## Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
``` 