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
    <div className="bg-white border-2 border-[#D0D0D0] shadow-soft p-12 max-w-md w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-[#0A0A0A] tracking-tight">Create Account</h1>
        <p className="text-[#6B6B6B] mt-2 font-light">Start your journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            Account created successfully! Redirecting...
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-[#0A0A0A] mb-2 tracking-wide uppercase">
            Full Name
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            className="w-full px-4 py-3 border-2 border-[#D0D0D0] focus:border-[#2A2A2A] focus:outline-none transition-colors text-sm bg-white text-[#0A0A0A]"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-2 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#0A0A0A] mb-2 tracking-wide uppercase">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-4 py-3 pr-12 border-2 border-[#D0D0D0] focus:border-[#2A2A2A] focus:outline-none transition-colors text-sm bg-white text-[#0A0A0A]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[#6B6B6B] text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0A0A0A] hover:underline font-medium transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
