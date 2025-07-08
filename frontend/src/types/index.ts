export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  author: User
  parentId?: string
  replies: Comment[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
  isDeleted: boolean
  isEdited: boolean
  level: number
  // Backend computed properties
  canEdit: boolean
  canDelete: boolean
  canRestore: boolean
}

export interface Notification {
  id: string
  userId: string
  commentId: string
  type: 'reply'
  message: string
  isRead: boolean
  createdAt: string
  comment?: Comment
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface CreateCommentRequest {
  content: string
  parentId?: string
}

export interface UpdateCommentRequest {
  content: string
}

export interface ApiError {
  message: string | string[]
  error: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface PaginatedComments extends PaginatedResponse<Comment> {
  comments: Comment[]
}

export interface PaginatedNotifications extends PaginatedResponse<Notification> {
  notifications: Notification[]
}
