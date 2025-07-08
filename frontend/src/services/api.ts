import axios, { AxiosResponse } from 'axios'
import {
  User,
  Comment,
  Notification,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export class ApiService {
  // Auth endpoints
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data)
    return response.data
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data)
    return response.data
  }

  static async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await api.get('/auth/profile')
    return response.data
  }

  // Comment endpoints
  static async getComments(): Promise<{ comments: Comment[]; total: number; totalPages: number }> {
    const response = await api.get('/comments')
    return response.data
  }

  static async getComment(id: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await api.get(`/comments/${id}`)
    return response.data
  }

  static async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response: AxiosResponse<Comment> = await api.post('/comments', data)
    return response.data
  }

  static async updateComment(id: string, data: UpdateCommentRequest): Promise<Comment> {
    const response: AxiosResponse<Comment> = await api.put(`/comments/${id}`, data)
    return response.data
  }

  static async deleteComment(id: string): Promise<void> {
    await api.delete(`/comments/${id}`)
  }

  static async restoreComment(id: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await api.post(`/comments/${id}/restore`)
    return response.data
  }

  // Notification endpoints
  static async getNotifications(): Promise<Notification[]> {
    const response: AxiosResponse<Notification[]> = await api.get('/notifications')
    return response.data
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`)
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    await api.put('/notifications/read-all')
  }
}
