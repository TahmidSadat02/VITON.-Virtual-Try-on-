'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDresses: 0,
    totalTryOns: 0,
    tryOnsToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })

        // Get total dresses
        const { count: dressesCount } = await supabase
          .from('dresses')
          .select('*', { count: 'exact', head: true })

        // Get total try-ons
        const { count: tryOnsCount } = await supabase
          .from('try_on_sessions')
          .select('*', { count: 'exact', head: true })

        // Get today's try-ons
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const { count: todayCount } = await supabase
          .from('try_on_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())

        setStats({
          totalUsers: usersCount || 0,
          totalDresses: dressesCount || 0,
          totalTryOns: tryOnsCount || 0,
          tryOnsToday: todayCount || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Dresses',
      value: stats.totalDresses,
      icon: ShoppingBag,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Total Try-Ons',
      value: stats.totalTryOns,
      icon: Sparkles,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Try-Ons Today',
      value: stats.tryOnsToday,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your virtual try-on admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/dresses"
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Dresses</h3>
            <p className="text-sm text-gray-600 mt-1">Add, edit, or remove dresses</p>
          </a>
          
          <a
            href="/admin/users"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
          </a>

          <a
            href="/"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <Sparkles className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Site</h3>
            <p className="text-sm text-gray-600 mt-1">See the user experience</p>
          </a>
        </div>
      </div>
    </div>
  )
}
