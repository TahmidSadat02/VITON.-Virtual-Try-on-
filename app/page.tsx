'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function GenderSelectionPage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredGender, setHoveredGender] = useState<'men' | 'women' | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGenderSelect = (gender: 'men' | 'women') => {
    setIsTransitioning(true)
    localStorage.setItem('selectedGender', gender)
    
    setTimeout(() => {
      router.push(`/${gender}`)
    }, 800)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Inter:wght@200;300;400;500&display=swap');
        
        .playfair {
          font-family: 'Playfair Display', serif;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1.2s ease forwards;
        }

        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-800 { animation-delay: 0.8s; }

        .glass-plate {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-plate:hover {
          transform: translateY(-4px);
        }

        .glass-men:hover {
          background: rgba(100, 160, 255, 0.12);
          border-color: rgba(120, 170, 255, 0.35);
          box-shadow: 
            0 16px 48px rgba(60, 130, 255, 0.2),
            0 0 60px rgba(100, 160, 255, 0.08),
            inset 0 1px 0 rgba(140, 190, 255, 0.25),
            inset 0 -1px 0 rgba(100, 160, 255, 0.08);
        }

        .glass-women:hover {
          background: rgba(255, 120, 170, 0.12);
          border-color: rgba(255, 140, 180, 0.35);
          box-shadow: 
            0 16px 48px rgba(255, 100, 150, 0.2),
            0 0 60px rgba(255, 120, 170, 0.08),
            inset 0 1px 0 rgba(255, 160, 200, 0.25),
            inset 0 -1px 0 rgba(255, 120, 170, 0.08);
        }

        .glass-plate::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .glass-plate::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        .glass-enter-btn {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-men:hover .glass-enter-btn {
          background: rgba(100, 160, 255, 0.9);
          color: #FFFFFF !important;
          border-color: rgba(120, 170, 255, 0.8);
          box-shadow: 0 0 30px rgba(100, 160, 255, 0.25);
        }

        .glass-women:hover .glass-enter-btn {
          background: rgba(255, 120, 170, 0.9);
          color: #FFFFFF !important;
          border-color: rgba(255, 140, 180, 0.8);
          box-shadow: 0 0 30px rgba(255, 120, 170, 0.25);
        }

        .shimmer-text {
          background: linear-gradient(
            120deg, 
            rgba(255,255,255,0.4) 0%, 
            rgba(255,255,255,0.8) 25%, 
            rgba(255,255,255,0.4) 50%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .divider-line {
          width: 1px;
          background: linear-gradient(
            180deg, 
            transparent 0%, 
            rgba(255,255,255,0.2) 30%, 
            rgba(255,255,255,0.2) 70%, 
            transparent 100%
          );
        }
      `}</style>

      <div className={`min-h-screen relative overflow-hidden transition-all duration-800 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          
          {/* Brand Header */}
          <div className={`text-center mb-16 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-white/50 text-xs tracking-[0.5em] uppercase mb-4 animate-delay-200" style={{ animationFillMode: 'backwards' }}>
              Redefining Fashion
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-light tracking-[0.25em] playfair mb-4">
              VIRTUALTRY
            </h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-4"></div>
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase font-light">
              Choose Your Style
            </p>
          </div>

          {/* Glass Buttons Container */}
          <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 ${mounted ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`} style={{ animationFillMode: 'backwards' }}>
            
            {/* MEN Glass Plate */}
            <div
              className="glass-plate glass-men relative rounded-2xl cursor-pointer w-72 md:w-80 h-56 md:h-64 flex flex-col items-center justify-center group"
              onClick={() => handleGenderSelect('men')}
              onMouseEnter={() => setHoveredGender('men')}
              onMouseLeave={() => setHoveredGender(null)}
            >
              {/* Icon */}
              <div className="mb-5 transition-transform duration-500 group-hover:scale-110">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/60 group-hover:text-blue-300 transition-colors duration-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-white text-3xl md:text-4xl font-light tracking-[0.3em] playfair mb-6 group-hover:tracking-[0.4em] transition-all duration-500">
                MEN
              </h2>

              {/* Enter Button */}
              <button className="glass-enter-btn text-white/80 px-8 py-2.5 rounded-full text-xs tracking-[0.3em] uppercase font-light">
                Explore
              </button>

              {/* Hover glow effect */}
              <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(100,160,255,0.15) 0%, transparent 50%, rgba(100,160,255,0.05) 100%)',
              }}></div>
            </div>

            {/* Divider */}
            <div className="divider-line hidden md:block h-40 mx-2"></div>
            <div className="block md:hidden w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* WOMEN Glass Plate */}
            <div
              className="glass-plate glass-women relative rounded-2xl cursor-pointer w-72 md:w-80 h-56 md:h-64 flex flex-col items-center justify-center group"
              onClick={() => handleGenderSelect('women')}
              onMouseEnter={() => setHoveredGender('women')}
              onMouseLeave={() => setHoveredGender(null)}
            >
              {/* Icon */}
              <div className="mb-5 transition-transform duration-500 group-hover:scale-110">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/60 group-hover:text-pink-300 transition-colors duration-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-white text-3xl md:text-4xl font-light tracking-[0.3em] playfair mb-6 group-hover:tracking-[0.4em] transition-all duration-500">
                WOMEN
              </h2>

              {/* Enter Button */}
              <button className="glass-enter-btn text-white/80 px-8 py-2.5 rounded-full text-xs tracking-[0.3em] uppercase font-light">
                Explore
              </button>

              {/* Hover glow effect */}
              <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(255,120,170,0.15) 0%, transparent 50%, rgba(255,120,170,0.05) 100%)',
              }}></div>
            </div>

          </div>

          {/* Bottom tagline */}
          <div className={`mt-16 text-center ${mounted ? 'animate-fade-in animate-delay-800' : 'opacity-0'}`} style={{ animationFillMode: 'backwards' }}>
            <p className="text-white/25 text-xs tracking-[0.4em] uppercase font-light">
              Try Before You Buy
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
