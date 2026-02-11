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
      accent: 'rgba(96, 165, 250, 0.2)',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Total Dresses',
      value: stats.totalDresses,
      icon: ShoppingBag,
      accent: 'rgba(244, 114, 182, 0.2)',
      iconColor: 'text-pink-400',
    },
    {
      title: 'Total Try-Ons',
      value: stats.totalTryOns,
      icon: Sparkles,
      accent: 'rgba(192, 132, 252, 0.2)',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Try-Ons Today',
      value: stats.tryOnsToday,
      icon: TrendingUp,
      accent: 'rgba(74, 222, 128, 0.2)',
      iconColor: 'text-green-400',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/40 mt-2">Welcome to your virtual try-on admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="rounded-xl p-6" style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ background: stat.accent }}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-white/50 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6" style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/dresses"
            className="p-4 rounded-lg transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(192, 132, 252, 0.06)',
              border: '1px solid rgba(192, 132, 252, 0.15)',
            }}
          >
            <ShoppingBag className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-white">Manage Dresses</h3>
            <p className="text-sm text-white/40 mt-1">Add, edit, or remove dresses</p>
          </a>
          
          <a
            href="/admin/users"
            className="p-4 rounded-lg transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(96, 165, 250, 0.06)',
              border: '1px solid rgba(96, 165, 250, 0.15)',
            }}
          >
            <Users className="h-8 w-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-white">Manage Users</h3>
            <p className="text-sm text-white/40 mt-1">View and manage user accounts</p>
          </a>

          <a
            href="/"
            className="p-4 rounded-lg transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(74, 222, 128, 0.06)',
              border: '1px solid rgba(74, 222, 128, 0.15)',
            }}
          >
            <Sparkles className="h-8 w-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-white">View Site</h3>
            <p className="text-sm text-white/40 mt-1">See the user experience</p>
          </a>
        </div>
      </div>
    </div>
  )
}
