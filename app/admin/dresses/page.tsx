'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect old dresses page to men's collection
export default function AdminDressesPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/men')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
}
