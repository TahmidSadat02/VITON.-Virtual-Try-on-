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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-light mb-6 text-center tracking-tight playfair">
          {content.title}
        </h1>
        <p className="text-lg md:text-xl font-light mb-12 tracking-[0.2em] uppercase text-center">
          {content.subtitle}
        </p>
        <button className="border-2 border-white px-10 py-4 text-sm tracking-[0.3em] uppercase font-light hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
          SHOP NOW
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
