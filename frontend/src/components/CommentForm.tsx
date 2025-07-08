'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiService } from '@/services/api'
import { Send, User } from 'lucide-react'
import Link from 'next/link'

interface CommentFormProps {
  onCommentCreated: () => void
}

export function CommentForm({ onCommentCreated }: CommentFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsLoading(true)
    try {
      await ApiService.createComment({ content: content.trim() })
      setContent('')
      onCommentCreated()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Conversation</h3>
          <p className="text-gray-600 mb-4">
            Please log in to share your thoughts and join the discussion.
          </p>
          <div className="flex space-x-3 justify-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900">Share Your Thoughts</CardTitle>
            <p className="text-sm text-gray-600">What&apos;s on your mind, {user.username}?</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask questions, or join the discussion..."
            rows={4}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-base text-gray-900 placeholder:text-gray-500"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length > 0 && `${content.length} characters`}
            </span>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
