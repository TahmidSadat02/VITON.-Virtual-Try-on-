'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/client'

export default function MenPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    const selectedGender = localStorage.getItem('selectedGender')
    if (selectedGender !== 'men') {
      router.push('/')
      return
    }

    const fetchProducts = async () => {
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .eq('is_visible', true)
        .eq('gender', 'men')
        .order('is_featured', { ascending: false })
      
      setProducts(data || [])
      setIsLoading(false)
    }

    fetchProducts()
  }, [router])

  // Listen for hash changes from navbar clicks
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase()
      if (hash) {
        setActiveCategory(hash)
        // Scroll to products section smoothly
        const el = document.getElementById('products-section')
        if (el && hash !== 'all') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))].sort()

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())

  // Group products by category for "All" view
  const groupedProducts = categories.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat)
    return acc
  }, {} as Record<string, any[]>)

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
      <div className="fixed inset-0 -z-10 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

      <Navbar gender="men" />
      <HeroSection gender="men" />

      {/* Products Section */}
      <div id="products-section" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-16 flex-wrap">
            {['All', ...categories].map((cat) => {
              const isActive = activeCategory === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat.toLowerCase())
                    window.history.replaceState(null, '', `#${cat.toLowerCase()}`)
                  }}
                  className={`px-5 py-2 text-[11px] tracking-[0.2em] uppercase rounded-full transition-all duration-300 font-medium ${
                    isActive ? 'text-[#0A0A0A] scale-105' : 'text-white/50 hover:text-white/80'
                  }`}
                  style={isActive ? {
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                  } : {
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* ALL view — grouped by category */}
          {activeCategory === 'all' ? (
            <div className="space-y-20">
              {categories.map((cat) => (
                <div key={cat} id={cat.toLowerCase()}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-2">Category</p>
                      <h2 className="text-3xl md:text-4xl font-light text-white playfair">{cat}</h2>
                    </div>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.toLowerCase())
                        window.history.replaceState(null, '', `#${cat.toLowerCase()}`)
                      }}
                      className="text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {groupedProducts[cat]?.map((product: any, index: number) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={product.image_url}
                        gender="men"
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single category view */
            <div>
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-3">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-white playfair capitalize">
                  {activeCategory}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image_url}
                    gender="men"
                    index={index}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/40 font-light">No items found in this category</p>
                </div>
              )}
            </div>
          )}
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
