# Celestial Matrix - Scalable Comment System

A modern, scalable comment system built with Next.js frontend and NestJS backend, featuring secure authentication, nested comments, real-time notifications, and comprehensive Docker deployment.

## 🌟 Features

### Core Features
- **Secure Authentication**: JWT-based authentication with registration/login
- **Nested Comments**: Multi-level comment threads (up to 5 levels deep)
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
   cp .env
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
   cp .env
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
│   │   ├── comments/       # Comments module
│   │   ├── notifications/  # Notifications module
│   │   ├── entities/       # Database entities
│   │   └── decorators/     # Custom decorators
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
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

### Comments
- `GET /comments` - Get all comments (nested)
- `POST /comments` - Create new comment
- `GET /comments/:id` - Get specific comment
- `PATCH /comments/:id` - Update comment (15min limit)
- `DELETE /comments/:id` - Delete comment (15min limit)
- `POST /comments/:id/restore` - Restore deleted comment (15min limit)

### Notifications
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/mark-all-read` - Mark all as read

### Health Check
- `GET /health` - Service health status

## 🧪 Testing the API

### Using Postman

1. **Register a new user**
   ```bash
   POST http://localhost:3001/auth/register
   Content-Type: application/json
   
   {
     \"username\": \"testuser\",
     \"email\": \"test@example.com\",
     \"password\": \"password123\"
   }
   ```

2. **Login and get token**
   ```bash
   POST http://localhost:3001/auth/login
   Content-Type: application/json
   
   {
     \"email\": \"test@example.com\",
     \"password\": \"password123\"
   }
   ```

3. **Create a comment (with token)**
   ```bash
   POST http://localhost:3001/comments
   Content-Type: application/json
   Authorization: Bearer <your-jwt-token>
   
   {
     \"content\": \"This is my first comment!\"
   }
   ```

4. **Reply to a comment**
   ```bash
   POST http://localhost:3001/comments
   Content-Type: application/json
   Authorization: Bearer <your-jwt-token>
   
   {
     \"content\": \"This is a reply!\",
     \"parentId\": \"<parent-comment-id>\"
   }
   ```

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Class-validator for all inputs
- **SQL Injection Prevention**: TypeORM query builder
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Sensitive data protection

## 🎨 Frontend Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Automatic refresh of comments and notifications
- **Nested Threading**: Visual hierarchy for comment threads
- **Interactive Actions**: Edit, delete, restore with time limits
- **Notification Center**: Dedicated notifications page
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Comprehensive error handling and user feedback

## 📊 Database Schema

### Users Table
- id (UUID, Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- timestamps

### Comments Table
- id (UUID, Primary Key)
- content
- authorId (Foreign Key)
- parentId (Self-referencing Foreign Key)
- deletedAt (Soft delete)
- timestamps

### Notifications Table
- id (UUID, Primary Key)
- userId (Foreign Key)
- commentId (Foreign Key)
- type ('reply')
- message
- isRead (Boolean)
- timestamps

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

3. **Set up reverse proxy (Nginx example)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```

2. **Frontend API Connection Issues**
   ```bash
   # Ensure backend is running
   curl http://localhost:3001/health
   
   # Check environment variables
   echo $NEXT_PUBLIC_API_URL
   ```

3. **Docker Build Issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Support

For support and questions:
- Check the GitHub Issues page
- Review the API documentation
- Examine the console logs for error details

---

**Built with ❤️ using Next.js, NestJS, and modern web technologies.**
