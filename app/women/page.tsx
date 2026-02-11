'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/client'

export default function WomenPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const selectedGender = localStorage.getItem('selectedGender')
    if (selectedGender !== 'women') {
      router.push('/')
      return
    }

    const fetchProducts = async () => {
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .eq('is_visible', true)
        .order('is_featured', { ascending: false })
        .limit(8)
      
      setProducts(data || [])
      setIsLoading(false)
    }

    fetchProducts()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/70 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Fixed dark background */}
      <div className="fixed inset-0 bg-[#0A0A0A] -z-20"></div>
      {/* Subtle background image for glass depth */}
      <div className="fixed inset-0 -z-10 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

      <Navbar gender="women" />
      <HeroSection gender="women" />

      {/* Products Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-4">NEW ARRIVALS</p>
            <h2 className="text-4xl md:text-5xl font-light text-white playfair">
              Discover Our Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image_url}
                gender="women"
                index={index}
              />
            ))}
          </div>

          {/* View All Button - Glass */}
          <div className="text-center mt-16">
            <button className="px-12 py-4 text-sm tracking-[0.3em] uppercase font-light text-white/80 rounded-full transition-all duration-500 hover:scale-105 hover:text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}>
              VIEW ALL
            </button>
          </div>
        </div>
      </div>

      {/* Features Section - Glass */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'FREE SHIPPING', desc: 'On orders over ৳5000' },
              { title: 'EASY RETURNS', desc: '30-day return policy' },
              { title: 'PREMIUM QUALITY', desc: 'Carefully selected materials' },
            ].map((feature, i) => (
              <div key={i} className="text-center py-8 px-6 rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                }}>
                <h3 className="text-lg font-light tracking-wide mb-2 text-white/90">{feature.title}</h3>
                <p className="text-sm text-white/40 font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Glass */}
      <footer className="relative py-12">
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-light tracking-[0.2em] mb-4 playfair text-white">VIRTUALTRY</p>
          <p className="text-sm text-white/30 font-light">&copy; 2026 VirtualTry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
