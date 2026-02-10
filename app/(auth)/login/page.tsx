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
    <div className="bg-white border-2 border-[#D0D0D0] shadow-soft p-12 max-w-md w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-[#0A0A0A] tracking-tight">Welcome Back</h1>
        <p className="text-[#6B6B6B] mt-2 font-light">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#0A0A0A] mb-2 tracking-wide uppercase">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 border-2 border-[#D0D0D0] focus:border-[#2A2A2A] focus:outline-none transition-colors text-sm bg-white text-[#0A0A0A]"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-[#0A0A0A] mb-2 tracking-wide uppercase">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 pr-12 border-2 border-[#D0D0D0] focus:border-[#2A2A2A] focus:outline-none transition-colors text-sm bg-white text-[#0A0A0A]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors tracking-wide"
          >
            FORGOT PASSWORD?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[#6B6B6B] text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#0A0A0A] hover:underline font-medium transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
