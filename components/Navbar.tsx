'use client'

import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogOut, Settings, UserCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  gender: 'men' | 'women'
}

export default function Navbar({ gender }: NavbarProps) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('selectedGender')
    router.push('/')
    router.refresh()
  }

  const categories = gender === 'men' 
    ? ['Shirts', 'Jackets', 'Pants', 'Accessories']
    : ['Dresses', 'Tops', 'Skirts', 'Accessories']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Categories */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${gender}#${category.toLowerCase()}`}
                className="text-sm tracking-wider uppercase transition-all duration-300 text-white/70 hover:text-white"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Center - Logo */}
          <Link 
            href="/" 
            className="text-2xl font-light tracking-[0.2em] transition-colors duration-300 playfair text-white"
          >
            VIRTUALTRY
          </Link>

          {/* Right - Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className="transition-all duration-300 text-white/70 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href={`/${gender}/cart`}
              className="transition-all duration-300 text-white/70 hover:text-white"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="transition-all duration-300 text-white/70 hover:text-white"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Glass Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}>
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <UserCircle className="w-6 h-6 text-white/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-white/50" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-white/50" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Glass */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}>
            <div className="flex flex-col space-y-4 p-4">
              {/* User Info in Mobile */}
              {user && (
                <div className="pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <UserCircle className="w-6 h-6 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/${gender}#${category.toLowerCase()}`}
                  className="text-sm tracking-wider uppercase text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              
              <div className="border-t border-white/10 pt-4 space-y-3">
                <Link
                  href="/profile"
                  className="flex items-center text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-white/70 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>

              <div className="border-t border-white/10 pt-4 flex space-x-6">
                <button className="text-white/70 hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <Link href={`/${gender}/cart`} className="text-white/70 hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
