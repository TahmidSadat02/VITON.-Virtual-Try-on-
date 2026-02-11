'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/lib/validations/schemas'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) throw error

      // Check if email confirmation is required
      if (signUpData?.user && !signUpData.session) {
        setError('Please check your email to confirm your account before signing in.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        localStorage.removeItem('selectedGender')
        router.push('/')
        router.refresh()
      }, 2000)
    } catch (err: any) {
      // Better error messages
      if (err.message?.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(err.message || 'Failed to sign up')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-12 max-w-md w-full relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}>
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>

      <div className="mb-10">
        <h1 className="text-3xl font-light text-white tracking-tight playfair">Create Account</h1>
        <p className="text-white/40 mt-2 font-light">Start your journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg px-4 py-3 text-sm text-green-300" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            Account created successfully! Redirecting...
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
            Full Name
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-2 text-xs text-red-400">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide text-white font-medium rounded-lg transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#0A0A0A' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#FFFFFF' }}
        >
          {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white/80 hover:text-white hover:underline font-medium transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
