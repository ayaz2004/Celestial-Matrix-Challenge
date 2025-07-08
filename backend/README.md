# Comment System Backend

A scalable, production-ready comment system built with NestJS, TypeScript, and PostgreSQL. Features secure authentication, nested comments, time-based edit/delete permissions, and real-time notifications.

## 🚀 Features

### Core Features
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🗂️ **Nested Comments**: Unlimited nesting levels with hierarchical structure
- ✏️ **Edit Comments**: 15-minute edit window for comment modifications
- 🗑️ **Delete/Restore**: 15-minute grace period for comment deletion and restoration
- ⚠️ **Notifications**: Real-time notification system for comment replies with read/unread status

### Performance & Scalability
- 📈 **Optimized Queries**: Efficient database queries with proper indexing
- 📦 **Containerized**: Fully Dockerized for easy deployment and scaling
- 🛡️ **Input Validation**: Comprehensive request validation and sanitization
- 📊 **Pagination**: Efficient pagination for comments and notifications

## 🛠️ Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (if running locally)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   cd backend
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the API**:
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Update the .env file with your database credentials
   ```

3. **Start PostgreSQL** (ensure it's running on port 5432)

4. **Run the application**:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Comments
- `GET /comments` - Get paginated comments (query: page, limit)
- `POST /comments` - Create a new comment (requires auth)
- `GET /comments/:id` - Get a specific comment
- `GET /comments/:id/replies` - Get comment replies
- `PUT /comments/:id` - Update comment (requires auth, 15-min window)
- `DELETE /comments/:id` - Delete comment (requires auth, 15-min window)
- `PUT /comments/:id/restore` - Restore deleted comment (requires auth, 15-min window)

### Notifications
- `GET /notifications` - Get user notifications (requires auth)
- `GET /notifications/unread-count` - Get unread notification count (requires auth)
- `PUT /notifications/:id/read` - Mark notification as read (requires auth)
- `PUT /notifications/read-all` - Mark all notifications as read (requires auth)

### Health Check
- `GET /health` - Application health status

## 🗃️ Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (Unique)
- `username` (Unique)
- `password` (Hashed)
- `createdAt`, `updatedAt`

### Comments
- `id` (UUID, Primary Key)
- `content` (Text)
- `isDeleted` (Boolean)
- `isEdited` (Boolean)
- `deletedAt` (Nullable Date)
- `authorId` (Foreign Key to Users)
- `parentId` (Foreign Key to Comments, nullable)
- `createdAt`, `updatedAt`

### Notifications
- `id` (UUID, Primary Key)
- `type` (Enum: comment_reply)
- `message` (Text)
- `isRead` (Boolean)
- `userId` (Foreign Key to Users)
- `commentId` (Foreign Key to Comments)
- `createdAt`

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=comment_system

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
```

## 🐳 Docker Configuration

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing with Postman

### 1. Register a User
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123"
}
```

### 2. Login
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Create a Comment
```http
POST http://localhost:3000/comments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "This is my first comment!"
}
```

### 4. Reply to a Comment
```http
POST http://localhost:3000/comments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "This is a reply!",
  "parentId": "COMMENT_UUID"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data in environment variables

## ⏱️ Grace Period Logic

### Edit Window (15 minutes)
- Comments can be edited within 15 minutes of creation
- `canEdit` computed property checks the time difference

### Delete/Restore Window (15 minutes)
- Comments can be deleted within 15 minutes of creation
- Deleted comments can be restored within 15 minutes of deletion
- `canDelete` and `canRestore` computed properties manage these windows

## 🚀 Deployment

### Docker Production Deployment

1. **Build production image**:
   ```bash
   docker build -t comment-system-backend .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-specific Configurations
- Development: Full logging, auto-reload
- Production: Optimized builds, health checks

## 📊 Monitoring & Health Checks

- **Health Endpoint**: `/health` for load balancer checks
- **Database Health**: Automatic connection monitoring
- **Container Health**: Docker health checks configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for production deployment and Postman testing!** 🚀
