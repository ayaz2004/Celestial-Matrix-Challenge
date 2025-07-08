import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  
  // Ensure we have valid dates
  if (isNaN(past.getTime())) {
    return 'unknown time'
  }
  
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // Handle future dates (should not happen but just in case)
  if (diffInSeconds < 0) {
    return 'just now'
  }

  if (diffInSeconds < 60) {
    return diffInSeconds < 10 ? 'just now' : `${diffInSeconds}s ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
}

export function canEditOrDelete(createdAt: string | Date): boolean {
  const now = new Date()
  const created = new Date(createdAt)
  
  // Ensure we have valid dates
  if (isNaN(created.getTime())) {
    console.error('Invalid createdAt date:', createdAt)
    return false
  }
  
  const diffInMinutes = (now.getTime() - created.getTime()) / (1000 * 60)
  
  // Only log if close to expiry or expired
  if (diffInMinutes > 14 || diffInMinutes <= 15.5) {
    console.log('Edit time check:', {
      diffInMinutes: Math.round(diffInMinutes * 100) / 100,
      timeLeft: Math.max(0, 15 - diffInMinutes),
      canEdit: diffInMinutes <= 15
    })
  }
  
  return diffInMinutes <= 15
}

export function canRestore(deletedAt: string | Date | null | undefined): boolean {
  if (!deletedAt) return false
  
  const now = new Date()
  const deleted = new Date(deletedAt)
  
  // Ensure we have valid dates
  if (isNaN(deleted.getTime())) {
    console.error('Invalid deletedAt date:', deletedAt)
    return false
  }
  
  const diffInMinutes = (now.getTime() - deleted.getTime()) / (1000 * 60)
  
  // Only log if close to expiry or expired
  if (diffInMinutes > 14 || diffInMinutes <= 15.5) {
    console.log('Restore time check:', {
      diffInMinutes: Math.round(diffInMinutes * 100) / 100,
      timeLeft: Math.max(0, 15 - diffInMinutes),
      canRestore: diffInMinutes <= 15
    })
  }
  
  return diffInMinutes <= 15
}

export function getRemainingEditTime(createdAt: string | Date): number {
  const now = new Date()
  const created = new Date(createdAt)
  
  if (isNaN(created.getTime())) return 0
  
  const diffInMinutes = (now.getTime() - created.getTime()) / (1000 * 60)
  return Math.max(0, 15 - diffInMinutes)
}

export function getRemainingRestoreTime(deletedAt: string | Date | null | undefined): number {
  if (!deletedAt) return 0
  
  const now = new Date()
  const deleted = new Date(deletedAt)
  
  if (isNaN(deleted.getTime())) return 0
  
  const diffInMinutes = (now.getTime() - deleted.getTime()) / (1000 * 60)
  return Math.max(0, 15 - diffInMinutes)
}

export function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return 'expired'
  
  if (minutes < 1) {
    const seconds = Math.floor(minutes * 60)
    return `${seconds}s left`
  }
  
  const mins = Math.floor(minutes)
  const secs = Math.floor((minutes - mins) * 60)
  
  if (mins === 0) {
    return `${secs}s left`
  } else if (secs === 0) {
    return `${mins}m left`
  } else {
    return `${mins}m ${secs}s left`
  }
}
