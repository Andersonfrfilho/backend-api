# Testing Guide

This guide provides instructions for testing the API endpoints, particularly those using the authentication providers.

## Prerequisites

- The application must be running (use `npm run start:dev`)
- The server runs on `http://localhost:3333` by default

## API Endpoints

### Health Check

Test the basic health endpoint:

```bash
curl -X GET "http://localhost:3333/health" \
  -H "accept: application/json"
```

Expected response: Health check information

### Authentication

#### Login Session

Test the login functionality which uses the JWT provider:

```bash
curl -X POST "http://localhost:3333/v1/auth/login-session" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPass123!"
  }'
```

**Request Body:**

- `email`: User's email address
- `password`: User's password (must be strong password)

**Expected Response:**

- Success: JWT tokens (access and refresh)
- Error: Authentication error if credentials are invalid

**Note:** This endpoint uses the custom JWT provider implemented with jsonwebtoken library instead of Passport.

### Mock API Provider Testing

Test the HTTP client provider mock that uses authenticated HTTP requests:

#### Get Posts

```bash
curl -X GET "http://localhost:3333/auth/mock/posts" \
  -H "accept: application/json"
```

**Expected Response:** Array of posts from JSONPlaceholder API

#### Get Specific Post

```bash
curl -X GET "http://localhost:3333/auth/mock/posts/1" \
  -H "accept: application/json"
```

**Expected Response:** Single post object with id 1

#### Create Post

```bash
curl -X POST "http://localhost:3333/auth/mock/posts" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "body": "This is a test post created via API",
    "userId": 1
  }'
```

**Request Body:**

- `title`: Post title
- `body`: Post content
- `userId`: User ID

**Expected Response:** Created post object with generated ID

**Note:** These endpoints use the MockApiProvider which wraps the authenticated HTTP provider, demonstrating how external API calls are made with authentication headers automatically included.

### Testing JWT Provider

1. First, obtain a JWT token using the login endpoint
2. Use the token to access protected routes (if any are implemented)
3. The JWT provider handles:
   - Token signing
   - Token verification
   - Token decoding

## Environment Variables

Make sure the following environment variables are set:

- `JWT_SECRET`: Secret key for JWT signing
- `MONGODB_URI`: MongoDB connection string
- Other database and service configurations

## Running Tests

To run the test suite:

```bash
npm run test
```

For end-to-end tests:

```bash
npm run test:e2e
```
