'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  LogOut,
  Sparkles,
  ChevronLeft
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Only allow your email as admin (check both exact match and contains)
      const ADMIN_EMAILS = ['admin@gmail.com', 'tahmidsadat2002@gmail.com']
      const isAdmin = ADMIN_EMAILS.some(email => 
        user.email?.toLowerCase() === email.toLowerCase()
      )
      
      console.log('Admin check:', { userEmail: user.email, isAdmin })
      
      if (!isAdmin) {
        console.log('Not admin, redirecting to home')
        router.push('/')
        return
      }

      setUser(user)
      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdmin()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/dresses', icon: ShoppingBag, label: 'Manage Dresses' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64" style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Sparkles className="h-6 w-6 text-white" />
            <span className="ml-3 text-lg font-light tracking-wider text-white">ADMIN</span>
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="mx-4 mt-6 px-4 py-3 text-white text-xs tracking-wider uppercase rounded-lg transition-all flex items-center justify-center font-medium hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            User View
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all text-sm tracking-wide ${
                    isActive
                      ? 'text-[#0A0A0A] font-medium'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={isActive ? {
                    background: 'rgba(255, 255, 255, 0.9)',
                  } : {
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="ml-3">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-light text-sm" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-light text-white truncate">
                  Admin
                </p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2.5 text-xs text-white rounded-lg transition-all tracking-wider uppercase font-medium hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  )
}
