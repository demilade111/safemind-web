# SafeMind Frontend

The frontend application for the SafeMind mental health platform. This web application is built using React, TypeScript, and Tailwind CSS.

## Features

- User authentication (login, registration)
- Dashboard with quick access to all features
- Mood tracking and visualization
- Journal entries
- Browse and connect with therapists
- Video therapy sessions
- Community discussions
- Educational resources
- User profile management

## Technologies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Socket.io**: Real-time communication
- **WebRTC**: Peer-to-peer video calls

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd safemind-web/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Docker Development

You can also run the frontend along with the backend and database using Docker:

```bash
# From the root of the project (safemind-web)
docker-compose -f docker-compose.dev.yml up
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Docker Production

To build and run the production Docker image:

```bash
# From the root of the project (safemind-web)
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
src/
├── assets/        # Static assets (images, icons)
├── components/    # Reusable components
├── contexts/      # React contexts (auth, etc.)
├── hooks/         # Custom React hooks
├── layouts/       # Page layouts
├── pages/         # Page components
├── services/      # API clients, services
├── utils/         # Utility functions
├── App.tsx        # Main App component
└── main.tsx       # Application entry point
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request
