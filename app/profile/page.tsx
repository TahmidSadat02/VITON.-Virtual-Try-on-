'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Shield, 
  Calendar,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // User data
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [createdAt, setCreatedAt] = useState('')

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Messages
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        setUser(user)
        setEmail(user.email || '')
        setCreatedAt(user.created_at || '')

        // Fetch profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFullName(profile.full_name || user.user_metadata?.full_name || '')
          setIsAdmin(profile.is_admin || false)
        } else {
          setFullName(user.user_metadata?.full_name || user.user_metadata?.name || '')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (fullName.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters')
      return
    }

    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })

      if (authError) throw authError

      // Update users table
      const { error: dbError } = await supabase
        .from('users')
        .update({ 
          full_name: fullName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (dbError) throw dbError

      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    setChangingPassword(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccessMessage('Password changed successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordSection(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('selectedGender')
    router.push('/')
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-white/50 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-white tracking-tight playfair">Profile Settings</h1>
          <p className="text-white/40 mt-2 font-light">Manage your account information</p>
        </div>

        {/* Success / Error Messages */}
        {successMessage && (
          <div className="mb-6 rounded-xl px-5 py-4 flex items-center space-x-3" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}>
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl px-5 py-4 flex items-center space-x-3" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          {/* Top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>

          {/* Avatar & Role Badge */}
          <div className="flex items-center space-x-4 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light text-white" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              {fullName ? fullName[0].toUpperCase() : email[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">{fullName || 'User'}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <p className="text-sm text-white/40">{email}</p>
                {isAdmin && (
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full text-purple-300" style={{
                    background: 'rgba(192, 132, 252, 0.15)',
                    border: '1px solid rgba(192, 132, 252, 0.25)',
                  }}>Admin</span>
                )}
              </div>
            </div>
          </div>

          {/* Full Name Field */}
          <div className="mb-6">
            <label className="flex items-center text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
              <User className="w-3.5 h-3.5 mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field (read-only) */}
          <div className="mb-6">
            <label className="flex items-center text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
              <Mail className="w-3.5 h-3.5 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-lg text-sm text-white/50 cursor-not-allowed"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            />
            <p className="text-xs text-white/30 mt-1.5">Email cannot be changed</p>
          </div>

          {/* Account Info */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg p-4" style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div className="flex items-center text-white/40 mb-1">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs uppercase tracking-wide">Member Since</span>
              </div>
              <p className="text-sm text-white/80">{formatDate(createdAt)}</p>
            </div>
            <div className="rounded-lg p-4" style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div className="flex items-center text-white/40 mb-1">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs uppercase tracking-wide">Account Type</span>
              </div>
              <p className="text-sm text-white/80">{isAdmin ? 'Administrator' : 'Standard User'}</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide text-white font-medium rounded-lg transition-all duration-500 hover:scale-[1.02] flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#0A0A0A' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#FFFFFF' }}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-white/60" />
                Change Password
              </h3>
              <p className="text-sm text-white/40 mt-1">Update your account password</p>
            </div>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="text-sm text-white/60 hover:text-white px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              >
                Change
              </button>
            )}
          </div>

          {showPasswordSection && (
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide text-white font-medium rounded-lg transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#0A0A0A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#FFFFFF' }}
                >
                  {changingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </button>
                <button
                  onClick={() => { setShowPasswordSection(false); setNewPassword(''); setConfirmPassword(''); setErrorMessage('') }}
                  className="py-3 px-6 text-sm text-white/50 hover:text-white rounded-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl p-8 relative overflow-hidden" style={{
          background: 'rgba(239, 68, 68, 0.04)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
        }}>
          <h3 className="text-lg font-medium text-white mb-2">Sign Out</h3>
          <p className="text-sm text-white/40 mb-4">Sign out of your account on this device</p>
          <button
            onClick={handleLogout}
            className="flex items-center py-2.5 px-5 text-sm text-red-300 rounded-lg transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)' }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
