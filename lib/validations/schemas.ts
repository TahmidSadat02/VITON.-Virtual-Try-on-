import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export const dressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  price: z.number().min(0).optional(),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const tryOnSchema = z.object({
  userPhotoId: z.string().uuid(),
  dressId: z.string().uuid(),
  textPrompt: z.string().max(500).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type DressInput = z.infer<typeof dressSchema>
export type TryOnInput = z.infer<typeof tryOnSchema>
