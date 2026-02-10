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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Categories */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${gender}#${category.toLowerCase()}`}
                className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isScrolled ? 'text-[#0A0A0A] hover:text-[#6B6B6B]' : 'text-white hover:text-gray-300'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Center - Logo */}
          <Link 
            href="/" 
            className={`text-2xl font-light tracking-[0.2em] transition-colors duration-300 playfair ${
              isScrolled ? 'text-[#0A0A0A]' : 'text-white'
            }`}
          >
            VIRTUALTRY
          </Link>

          {/* Right - Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className={`transition-colors duration-300 ${
              isScrolled ? 'text-[#0A0A0A] hover:text-[#6B6B6B]' : 'text-white hover:text-gray-300'
            }`}>
              <Search className="w-5 h-5" />
            </button>
            <Link
              href={`/${gender}/cart`}
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-[#0A0A0A] hover:text-[#6B6B6B]' : 'text-white hover:text-gray-300'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`transition-colors duration-300 ${
                  isScrolled ? 'text-[#0A0A0A] hover:text-[#6B6B6B]' : 'text-white hover:text-gray-300'
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white shadow-2xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-[#6B6B6B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A0A0A] truncate">
                          {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-xs text-[#6B6B6B] truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-[#0A0A0A] hover:bg-[#F5F5F0] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-[#6B6B6B]" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-[#0A0A0A] hover:bg-[#F5F5F0] transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-[#6B6B6B]" />
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
              <X className={`w-6 h-6 ${isScrolled ? 'text-[#0A0A0A]' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-[#0A0A0A]' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              {/* User Info in Mobile */}
              {user && (
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-[#6B6B6B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0A0A0A] truncate">
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-xs text-[#6B6B6B] truncate">
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
                  className="text-sm tracking-wider uppercase text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              
              <div className="border-t pt-4 space-y-3">
                <Link
                  href="/profile"
                  className="flex items-center text-sm text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>

              <div className="border-t pt-4 flex space-x-6">
                <button className="text-[#0A0A0A]">
                  <Search className="w-5 h-5" />
                </button>
                <Link href={`/${gender}/cart`} className="text-[#0A0A0A]">
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
