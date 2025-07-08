'use client'

import React, { useState, useEffect } from 'react'
import { Comment as CommentType } from '@/types'
import { Comment } from '@/components/Comment'
import { CommentForm } from '@/components/CommentForm'
import { ApiService } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function CommentList() {
  const { isAuthenticated } = useAuth()
  const [comments, setComments] = useState<CommentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setError(null)
      const data = await ApiService.getComments()
      // Handle paginated response from backend
      if (data && typeof data === 'object' && 'comments' in data && Array.isArray(data.comments)) {
        setComments(data.comments)
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        setComments(data)
      } else {
        console.error('API returned unexpected data format:', data)
        setComments([])
        setError('Invalid data format received from server.')
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
      setError('Failed to load comments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchComments()
    }
  }, [isAuthenticated])

  const handleUpdate = () => {
    fetchComments()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Loading comments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true)
              fetchComments()
            }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <CommentForm onCommentCreated={handleUpdate} />
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 text-lg">No comments yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}
