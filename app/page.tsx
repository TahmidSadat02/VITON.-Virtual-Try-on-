'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GenderSelectionPage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleGenderSelect = (gender: 'men' | 'women') => {
    setIsTransitioning(true)
    localStorage.setItem('selectedGender', gender)
    
    setTimeout(() => {
      router.push(`/${gender}`)
    }, 600)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        
        .playfair {
          font-family: 'Playfair Display', serif;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className={`min-h-screen flex transition-opacity duration-600 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {/* MEN Section - Left */}
        <div 
          className="relative w-1/2 h-screen overflow-hidden group cursor-pointer"
          onClick={() => handleGenderSelect('men')}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1587&auto=format&fit=crop"
              alt="Men's Fashion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500"></div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-8xl font-light mb-12 tracking-[0.3em] playfair">
              MEN
            </h1>
            <button className="border-2 border-white px-12 py-4 text-sm tracking-[0.3em] uppercase font-light hover:bg-white hover:text-black transition-all duration-300 group-hover:scale-110">
              ENTER
            </button>
          </div>
        </div>

        {/* WOMEN Section - Right */}
        <div 
          className="relative w-1/2 h-screen overflow-hidden group cursor-pointer"
          onClick={() => handleGenderSelect('women')}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop"
              alt="Women's Fashion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500"></div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-8xl font-light mb-12 tracking-[0.3em] playfair">
              WOMEN
            </h1>
            <button className="border-2 border-white px-12 py-4 text-sm tracking-[0.3em] uppercase font-light hover:bg-white hover:text-black transition-all duration-300 group-hover:scale-110">
              ENTER
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
