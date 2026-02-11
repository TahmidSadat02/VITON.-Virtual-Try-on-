'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/schemas'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Clear any previous gender selection to force new selection
      localStorage.removeItem('selectedGender')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      // Better error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you just signed up, please check your email to confirm your account first.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.')
      } else {
        setError(err.message || 'Failed to login')
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
        <h1 className="text-3xl font-light text-white tracking-tight playfair">Welcome Back</h1>
        <p className="text-white/40 mt-2 font-light">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

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

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wide"
          >
            FORGOT PASSWORD?
          </Link>
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
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white/80 hover:text-white hover:underline font-medium transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
