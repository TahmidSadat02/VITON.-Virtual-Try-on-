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
  const supabase = createClient()

  useEffect(() => {
    // Check gender selection
    const selectedGender = localStorage.getItem('selectedGender')
    if (selectedGender !== 'men') {
      router.push('/')
      return
    }

    // Fetch products
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .eq('is_visible', true)
        .in('category', ['Outerwear', 'Tops', 'Bottoms', 'Knitwear'])
        .order('is_featured', { ascending: false })
        .limit(8)
      
      setProducts(data || [])
      setIsLoading(false)
    }

    fetchProducts()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A0A0A]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <Navbar gender="men" />
      <HeroSection gender="men" />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] uppercase mb-4">NEW ARRIVALS</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#0A0A0A] playfair">
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
              gender="men"
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="border-2 border-[#0A0A0A] text-[#0A0A0A] px-12 py-4 text-sm tracking-[0.3em] uppercase font-light hover:bg-[#0A0A0A] hover:text-white transition-all duration-300">
            VIEW ALL
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-lg font-light tracking-wide mb-2">FREE SHIPPING</h3>
              <p className="text-sm text-[#6B6B6B] font-light">On orders over ৳5000</p>
            </div>
            <div>
              <h3 className="text-lg font-light tracking-wide mb-2">EASY RETURNS</h3>
              <p className="text-sm text-[#6B6B6B] font-light">30-day return policy</p>
            </div>
            <div>
              <h3 className="text-lg font-light tracking-wide mb-2">PREMIUM QUALITY</h3>
              <p className="text-sm text-[#6B6B6B] font-light">Carefully selected materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-light tracking-[0.2em] mb-4 playfair">VIRTUALTRY</p>
          <p className="text-sm text-gray-400 font-light">© 2026 VirtualTry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
