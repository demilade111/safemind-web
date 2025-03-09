# SafeMind Backend

This is the backend server for the SafeMind mental health platform, providing API endpoints and real-time communication for the web application.

## Features

- **User Authentication**: Secure login and registration with JWT authentication
- **User Profile Management**: Manage user profiles and preferences
- **Mood Tracking**: Track daily moods and emotions with analytics
- **Journaling**: Digital journaling for emotional processing
- **Therapist Sessions**: Schedule and manage one-on-one therapy sessions
- **Video Calls**: WebRTC-based real-time video calls with therapists
- **Live Broadcasting**: Allow therapists to broadcast live sessions
- **Community Forums**: Create and participate in support groups
- **Resource Library**: Browse and bookmark mental health articles and resources
- **Event Calendar**: View and RSVP to mental health events

## Technologies Used

- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Web application framework for building the API
- **Prisma ORM**: Next-generation ORM for database interactions
- **PostgreSQL**: Relational database for data storage
- **Socket.io**: Real-time bidirectional event-based communication
- **WebRTC**: Real-time communication for video calls
- **JWT**: Secure authentication mechanism
- **bcrypt**: Password hashing for security

## Folder Structure

```
src/
├── controllers/       # Route controllers for handling API requests
├── middleware/        # Express middleware (auth, validation, etc.)
├── routes/            # API route definitions
├── services/          # Business logic and services
│   └── socket.service.js  # WebSocket service for real-time communication
├── utils/             # Utility functions and helpers
│   └── webrtc.js      # WebRTC utilities for video calls
└── server.js          # Main server entry point

prisma/
└── schema.prisma      # Prisma schema with database models
```

## Setup and Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database
- Docker (optional, for local database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/safemind-web.git
   cd safemind-web/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your database connection string and JWT secret.

4. Start a PostgreSQL database:
   Using Docker:

   ```bash
   cd ..
   docker-compose up -d
   ```

   Or connect to an existing PostgreSQL database by updating the `DATABASE_URL` in `.env`.

5. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Mood Tracking

- `POST /api/mood` - Create a mood entry
- `GET /api/mood` - Get all mood entries
- `GET /api/mood/:id` - Get a mood entry by ID
- `PUT /api/mood/:id` - Update a mood entry
- `DELETE /api/mood/:id` - Delete a mood entry
- `GET /api/mood/analytics` - Get mood analytics

### Journaling

- `POST /api/journal` - Create a journal entry
- `GET /api/journal` - Get all journal entries
- `GET /api/journal/:id` - Get a journal entry by ID
- `PUT /api/journal/:id` - Update a journal entry
- `DELETE /api/journal/:id` - Delete a journal entry

### Therapists and Sessions

- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get a therapist by ID
- `POST /api/therapists/book` - Book a session with a therapist
- `GET /api/therapists/sessions` - Get all sessions for a user
- `GET /api/therapists/sessions/:id` - Get a specific session
- `PUT /api/therapists/sessions/:id/cancel` - Cancel a session

### Video and Chat

- `POST /api/video/sessions` - Create a video call session
- `GET /api/video/sessions/user` - Get user's video sessions
- `GET /api/video/sessions/therapist` - Get therapist's video sessions
- `GET /api/video/sessions/:id` - Get video session details
- `PUT /api/video/sessions/:id/status` - Update session status
- `POST /api/video/broadcast` - Start a live broadcast
- `GET /api/video/broadcast/active` - Get active broadcasts
- `GET /api/video/sessions/:id/messages` - Get chat messages for a session

### Communities

- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create a new community
- `GET /api/communities/:id` - Get a community by ID
- `POST /api/communities/:id/join` - Join a community
- `DELETE /api/communities/:id/leave` - Leave a community
- `GET /api/communities/:id/posts` - Get all posts in a community
- `POST /api/communities/:id/posts` - Create a new post
- `GET /api/communities/:communityId/posts/:postId` - Get a post
- `POST /api/communities/:communityId/posts/:postId/comments` - Add a comment

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/recommended` - Get recommended articles
- `GET /api/articles/bookmarked` - Get bookmarked articles
- `GET /api/articles/:id` - Get an article by ID
- `POST /api/articles/:id/bookmark` - Bookmark an article
- `DELETE /api/articles/:id/bookmark` - Remove a bookmark

### Events

- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get an event by ID
- `POST /api/events/:id/rsvp` - RSVP to an event
- `DELETE /api/events/:id/rsvp` - Cancel an RSVP

## WebSocket Events

### Authentication

- `authenticate` - Authenticate the socket connection
- `authenticated` - Authentication successful

### Video Call Signaling

- `call-user` - Initiate a call
- `call-incoming` - Incoming call notification
- `call-initiated` - Call successfully initiated
- `call-accept` - Accept a call
- `call-accepted` - Call accepted notification
- `ice-candidate` - Exchange ICE candidates
- `call-end` - End a call
- `call-ended` - Call ended notification

### Chat Messaging

- `send-message` - Send a message
- `message-sent` - Message sent confirmation
- `message-received` - New message notification

### Live Broadcasting

- `broadcast-start` - Start a broadcast
- `broadcast-started` - Broadcast started confirmation
- `broadcast-available` - New broadcast notification
- `broadcast-join` - Join a broadcast
- `broadcast-joined` - Successfully joined a broadcast
- `broadcast-viewer-joined` - Viewer joined notification
- `broadcast-answer` - Send answer to broadcaster
- `broadcast-viewer-answer` - Viewer's answer received
- `broadcast-end` - End a broadcast
- `broadcast-ended` - Broadcast ended notification

## Running in Production

For production deployment:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - Secret key for JWT signing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name](https://github.com/yourusername)
