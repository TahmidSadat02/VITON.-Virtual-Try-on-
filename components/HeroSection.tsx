interface HeroSectionProps {
  gender: 'men' | 'women'
}

export default function HeroSection({ gender }: HeroSectionProps) {
  const content = gender === 'men' 
    ? {
        title: 'Modern Essentials for Men',
        subtitle: 'Timeless design. Premium quality.',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop'
      }
    : {
        title: 'Refined Style for Women',
        subtitle: 'Elegance in every detail.',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'
      }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={content.image}
          alt={`${gender} fashion`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

      {/* Content - Glass Card */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center px-10 py-14 md:px-20 md:py-16 rounded-2xl relative"
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>
          {/* Top glass edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}></div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-center tracking-tight playfair text-white">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl font-light mb-12 tracking-[0.2em] uppercase text-center text-white/70">
            {content.subtitle}
          </p>
          <button className="px-10 py-4 text-sm tracking-[0.3em] uppercase font-light transition-all duration-500 hover:scale-105 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.color = '#0A0A0A'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = '#FFFFFF'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Glass pill */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-2"
          style={{
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.05)',
          }}>
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
