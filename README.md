# Celestial Matrix - Scalable Comment System

A modern, scalable comment system built with Next.js frontend and NestJS backend, featuring secure authentication, nested comments, real-time notifications, and comprehensive Docker deployment.

## 🌟 Features

### Core Features
- **Secure Authentication**: JWT-based authentication with registration/login
- **Unlimited Nested Comments**: Backend supports infinite nesting depth, frontend displays up to 5 levels
- **Real-time Notifications**: Get notified when someone replies to your comments
- **Time-limited Actions**: 15-minute window to edit/delete/restore comments
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Docker Ready**: Full containerization with Docker Compose

### Technical Features
- **Backend**: NestJS with TypeScript, PostgreSQL, TypeORM
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, Radix UI
- **Database**: PostgreSQL with proper relationships and indexing
- **Security**: Bcrypt password hashing, JWT tokens, input validation
- **Scalability**: Modular architecture, efficient queries, Docker deployment

## 🌳 Comment Nesting Architecture

### Backend (Unlimited Nesting)
- **Recursive Loading**: Comments are loaded recursively with no depth limit
- **Efficient Queries**: Uses recursive SQL queries for optimal performance
- **Flexible Data Structure**: Supports infinite comment threading

### Frontend (5-Level Display Limit)
- **Level 0**: Root comments
- **Level 1**: Direct replies to root comments
- **Level 2**: Replies to level 1 comments
- **Level 3**: Replies to level 2 comments
- **Level 4**: Replies to level 3 comments (maximum displayed)

```
Root Comment (Level 0)
├── Reply 1 (Level 1)
│   ├── Reply to Reply 1 (Level 2)
│   │   ├── Reply to Reply to Reply 1 (Level 3)
│   │   │   └── Reply to Reply to Reply to Reply 1 (Level 4) [Max Display]
│   │   └── Reply to Reply to Reply 2 (Level 3)
│   └── Reply to Reply 2 (Level 2)
└── Reply 2 (Level 1)
    └── Reply to Reply 3 (Level 2)
```

**Note**: While the backend can handle unlimited nesting, the frontend limits display to 5 levels for better user experience and readability.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Celestial Matrix Challenge"
   ```

2. **Configure environment variables**
   ```bash
   # Copy and edit the environment file
   cp .env.example .env
   # Edit .env with your preferred values
   ```

3. **Start all services**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL database**
   ```bash
   docker-compose up postgres -d
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```

5. **Start the backend**
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Set NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Celestial Matrix Challenge/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── comments/       # Comments module (recursive nesting)
│   │   ├── notifications/  # Notifications module
│   │   ├── entities/       # Database entities
│   │   └── decorators/     # Custom decorators
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components (5-level limit)
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── lib/           # Utility functions
│   └── Dockerfile
├── docker-compose.yml     # Full stack deployment
├── .env                   # Environment variables
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=comment_system
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🛠 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Comments (Unlimited Nesting)
- `GET /comments` - Get all comments with recursive nesting
- `POST /comments` - Create new comment (supports any nesting level)
- `GET /comments/:id` - Get specific comment with all nested replies
- `GET /comments/:id/replies` - Get all replies for a comment recursively
- `PATCH /comments/:id` - Update comment (15min limit)
- `DELETE /comments/:id` - Delete comment (15min limit)
- `POST /comments/:id/restore` - Restore deleted comment (15min limit)

### Notifications
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/mark-all-read` - Mark all as read

### Health Check
- `GET /health` - Service health status

## 🧪 Testing Nested Comments

### Create a Deep Comment Thread

1. **Create a root comment**
   ```bash
   POST http://localhost:3001/comments
   {
     "content": "This is a root comment (Level 0)"
   }
   ```

2. **Reply to the root comment**
   ```bash
   POST http://localhost:3001/comments
   {
     "content": "This is a reply to root (Level 1)",
     "parentId": "<root-comment-id>"
   }
   ```

3. **Reply to the reply**
   ```bash
   POST http://localhost:3001/comments
   {
     "content": "This is a reply to reply (Level 2)",
     "parentId": "<level-1-comment-id>"
   }
   ```

4. **Continue nesting** - Backend will handle unlimited levels, frontend will display up to 5 levels

### Testing Frontend Limitations

1. **Navigate to the comments page**
2. **Create nested comments** up to 5 levels
3. **Observe that Reply button disappears** after level 4
4. **Backend data** will still contain all nested levels

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Class-validator for all inputs
- **SQL Injection Prevention**: TypeORM query builder with recursive queries
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Sensitive data protection

## 🎨 Frontend Features

### Comment Threading
- **Visual Hierarchy**: Indented display with level indicators
- **Level Badges**: Shows current nesting level (0-4)
- **Maximum Nesting Warning**: Displays when max depth is reached
- **Smooth Transitions**: Animated expansions and collapses

### User Experience
- **Real-time Updates**: Automatic refresh of comments and notifications
- **Interactive Actions**: Edit, delete, restore with time limits
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Comprehensive error handling and user feedback

## 📊 Database Schema

### Users Table
- id (UUID, Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- timestamps

### Comments Table (Recursive Structure)
- id (UUID, Primary Key)
- content (Text)
- authorId (Foreign Key → Users)
- parentId (Foreign Key → Comments, Self-referencing)
- isDeleted (Boolean, default: false)
- deletedAt (Timestamp, nullable)
- isEdited (Boolean, default: false)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Notifications Table
- id (UUID, Primary Key)
- userId (Foreign Key → Users)
- commentId (Foreign Key → Comments)
- type (Enum: 'reply')
- message (Text)
- isRead (Boolean, default: false)
- createdAt (Timestamp)
- updatedAt (Timestamp)

## 🚀 Deployment

### Production Deployment

1. **Configure production environment**
   ```bash
   # Update .env with production values
   NODE_ENV=production
   JWT_SECRET=<strong-secret-key>
   POSTGRES_PASSWORD=<secure-password>
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Monitor performance** - Recursive queries are optimized but monitor for very deep nesting

## 📈 Performance Considerations

### Backend Optimization
- **Efficient Recursive Queries**: Uses optimized SQL for loading nested comments
- **Lazy Loading**: Comments are loaded on-demand
- **Database Indexing**: Proper indexes on parentId and authorId
- **Connection Pooling**: PostgreSQL connection pooling for scalability

### Frontend Optimization
- **Level Limiting**: Prevents UI performance issues with deep nesting
- **Virtual Scrolling**: For large comment lists
- **Memoization**: React.memo for comment components
- **Debounced Updates**: Efficient re-rendering



## 🆘 Troubleshooting

### Common Issues

1. **Deep Nesting Performance**
   ```bash
   # Monitor recursive query performance
   # Enable query logging in development
   ```

2. **Frontend Rendering Issues**
   ```bash
   # Check browser console for level warnings
   # Ensure comment component memoization
   ```

3. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```