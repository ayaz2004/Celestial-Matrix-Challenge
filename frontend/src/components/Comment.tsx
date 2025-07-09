'use client'

import React, { useState } from 'react'
import { Comment as CommentType } from '@/types'
import { formatTimeAgo, cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ApiService } from '@/services/api'
import { MessageCircle, Edit3, Trash2, RotateCcw, Send, X } from 'lucide-react'

interface CommentProps {
  comment: CommentType
  onUpdate: () => void
  level?: number
}

export function Comment({ comment, onUpdate, level = 0 }: CommentProps) {
  const { user } = useAuth()
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [editContent, setEditContent] = useState(comment.content)
  const [isLoading, setIsLoading] = useState(false)

  const isOwner = user?.id === comment.authorId
  
  // Frontend limit: 5 levels 
  const MAX_NESTING_LEVEL = 4 
  const canReply = level < MAX_NESTING_LEVEL

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsLoading(true)
    try {
      await ApiService.createComment({
        content: replyContent.trim(),
        parentId: comment.id,
      })
      setReplyContent('')
      setIsReplying(false)
      onUpdate()
    } catch (error) {
      console.error('Error creating reply:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false)
      setEditContent(comment.content)
      return
    }

    setIsLoading(true)
    try {
      await ApiService.updateComment(comment.id, { content: editContent.trim() })
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating comment:', error)
      setEditContent(comment.content)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsLoading(true)
    try {
      await ApiService.deleteComment(comment.id)
      onUpdate()
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    setIsLoading(true)
    try {
      await ApiService.restoreComment(comment.id)
      onUpdate()
    } catch (error) {
      console.error('Error restoring comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('space-y-4', level > 0 && 'ml-6 border-l-2 border-gradient-to-b from-blue-400 to-purple-400 pl-6')}>
      <Card className={cn(
        'transition-all duration-300 hover:shadow-lg border-0 bg-white/90 backdrop-blur-sm',
        comment.isDeleted && 'opacity-60 bg-gray-50/90',
        level === 0 && 'shadow-md'
      )}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Comment Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 text-lg">
                    {comment.author.username}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      Level {level}
                    </span>
                    {comment.updatedAt !== comment.createdAt && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        edited
                      </span>
                    )}
                    {isOwner && !comment.isDeleted && comment.canEdit && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        editable
                      </span>
                    )}
                    {comment.isDeleted && isOwner && comment.canRestore && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        restorable
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {user && (
                <div className="flex items-center space-x-2">
                  {/* Restore button - only within 15 minutes of deletion */}
                  {comment.isDeleted && isOwner && comment.canRestore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRestore}
                      disabled={isLoading}
                      className="h-9 px-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Restore comment"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Restore</span>
                    </Button>
                  )}
                  
                  {/* Edit and Delete buttons - only for own comments */}
                  {isOwner && !comment.isDeleted && (
                    <>
                      {/* Edit button - only within 15 minutes */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={isLoading || !comment.canEdit}
                        className={cn(
                          "h-9 px-3 rounded-lg transition-all duration-200",
                          comment.canEdit 
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                            : "text-gray-400 cursor-not-allowed"
                        )}
                        title={comment.canEdit ? "Edit comment" : "Edit window expired (15 minutes)"}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">
                          {comment.canEdit ? "Edit" : "Edit (expired)"}
                        </span>
                      </Button>
                      {/* Delete button - always available for own comments */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Delete</span>
                      </Button>
                    </>
                  )}
                  
                  {/* Reply button - only for other users' comments when not deleted and within nesting limit */}
                  {!comment.isDeleted && !isOwner && canReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplying(!isReplying)}
                      disabled={isLoading}
                      className="h-9 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Reply</span>
                    </Button>
                  )}
                  
                  {/* Show max nesting message */}
                  {!comment.isDeleted && !isOwner && !canReply && (
                    <div className="text-xs text-gray-500 italic">
                      Maximum nesting level reached
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Content */}
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                    rows={4}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-gray-900 placeholder:text-gray-500"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      disabled={isLoading || !editContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(comment.content)
                      }}
                      disabled={isLoading}
                      className="border-gray-500 hover:border-gray-600 text-gray-700 hover:text-gray-800 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p className={cn(
                    'text-gray-800 leading-relaxed text-base',
                    comment.isDeleted && 'italic text-gray-500 bg-gray-100 p-3 rounded-lg border border-gray-200'
                  )}>
                    {comment.isDeleted ? '🗑️ This comment has been deleted' : comment.content}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {isReplying && canReply && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Replying to {comment.author.username} (Level {level + 1})
                    </span>
                  </div>
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-gray-900 placeholder:text-gray-500"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={isLoading || !replyContent.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsReplying(false)
                        setReplyContent('')
                      }}
                      disabled={isLoading}
                      className="border-gray-500 hover:border-gray-600 text-gray-700 hover:text-gray-800 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Comments - Render all levels but frontend limits interaction */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              onUpdate={onUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}