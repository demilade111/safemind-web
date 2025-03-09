# SafeMind Platform

SafeMind is a comprehensive mental health platform that connects users with therapists through secure video calls, mood tracking tools, journal entries, community support, and educational resources.

## Project Structure

The project consists of two main parts:

- **Frontend**: A React application built with TypeScript and Tailwind CSS
- **Backend**: A Node.js Express server with Prisma ORM and PostgreSQL database

## Features

- **User Authentication**: Secure login and registration with JWT
- **Video Therapy**: WebRTC-based video calls between users and therapists
- **Mood Tracking**: Track and visualize mood patterns over time
- **Journaling**: Private journal entries with mood associations
- **Therapist Directory**: Browse and connect with licensed therapists
- **Community Support**: Join topic-based support communities
- **Educational Resources**: Access mental health articles, videos, and guides
- **Live Broadcasting**: Therapists can broadcast educational sessions to multiple users

## Technologies

### Frontend

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Socket.io client for real-time communication
- WebRTC for peer-to-peer video calls

### Backend

- Node.js with Express
- TypeScript
- Prisma ORM with PostgreSQL
- Socket.io for real-time communication
- JWT for authentication
- WebRTC signaling for video calls

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Setup and Run with Docker (Recommended)

The easiest way to run the entire platform is using Docker Compose:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd safemind-web
   ```

2. Create a `.env` file in the `backend` directory (copy from `.env.example`):

   ```
   DATABASE_URL=""
   JWT_SECRET="your_secure_jwt_secret_key_here"
   PORT=5000
   CORS_ORIGIN="http://localhost:5173"
   ```

3. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

This will start:

- Frontend server on http://localhost:5173
- Backend server on http://localhost:5000
- PostgreSQL database on port 5432

### Manual Setup

#### Backend

1. Navigate to the backend directory:

   ```bash
   cd safemind-web/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables (copy from `.env.example`):

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safemind_db?schema=public"
   JWT_SECRET="your_secure_jwt_secret_key_here"
   PORT=5000
   CORS_ORIGIN="http://localhost:5173"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd safemind-web/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables (copy from `.env.example`):

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Production Deployment

To deploy the application to production:

1. Create a `.env` file in the root directory:

   ```
   JWT_SECRET=your_secure_production_secret
   ```

2. Run the production Docker Compose setup:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

This will build and run:

- Frontend served on port 80
- Backend API on port 5000
- PostgreSQL database

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to mental health professionals who provided guidance on content
- International student organizations for their valuable feedback
- All contributors who have helped shape this platform
