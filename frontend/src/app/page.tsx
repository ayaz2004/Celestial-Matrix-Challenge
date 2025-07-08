'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { CommentList } from '@/components/CommentList'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, MessageSquare, Users, Bell, Shield } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        
        {/* Hero Section */}
        <main className="max-w-6xl mx-auto py-16 px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-6">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Welcome to Celestial Matrix
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join meaningful conversations and discussions with a modern, secure comment system designed for the next generation of online communities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-200">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Nested Comments</h3>
                <p className="text-gray-600">Multi-level comment threads for organized discussions and better engagement</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-xl mb-4 group-hover:bg-green-200 transition-colors">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time Notifications</h3>
                <p className="text-gray-600">Get instant notifications when someone replies to your comments</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-xl mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Safe</h3>
                <p className="text-gray-600">JWT authentication and enterprise-grade security for your data</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Community Driven</h3>
                <p className="text-gray-600">Built for meaningful conversations and authentic engagement</p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to join the conversation?
              </h2>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Create your account in seconds and start engaging with a community that values meaningful discussions
              </p>
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                  Create Account Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Celestial Matrix
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A place for meaningful conversations and discussions. Share your thoughts and engage with the community.
          </p>
        </div>
        
        <CommentList />
      </main>
    </div>
  )
}
