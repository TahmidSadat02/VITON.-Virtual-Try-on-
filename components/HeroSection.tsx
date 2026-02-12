'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  gender: 'men' | 'women' | 'both'
  is_active: boolean
  sort_order: number
}

interface HeroSectionProps {
  gender: 'men' | 'women'
}

export default function HeroSection({ gender }: HeroSectionProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number>(0)
  const supabase = createClient()

  const SLIDE_DURATION = 6000
  const TRANSITION_DURATION = 800

  const fallbackBanners: Banner[] = gender === 'men'
    ? [
        { id: '1', title: 'Modern Essentials for Men', subtitle: 'Timeless design. Premium quality.', image_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop', link_url: null, gender: 'men', is_active: true, sort_order: 1 },
      ]
    : [
        { id: '1', title: 'Refined Style for Women', subtitle: 'Elegance in every detail.', image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop', link_url: null, gender: 'women', is_active: true, sort_order: 1 },
      ]

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .in('gender', [gender, 'both'])
          .order('sort_order', { ascending: true })

        if (error) throw error
        setBanners(data && data.length > 0 ? data : fallbackBanners)
      } catch (error) {
        console.error('Error fetching banners:', error)
        setBanners(fallbackBanners)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [gender])

  // Progress bar animation
  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current)
    if (banners.length <= 1) return

    setProgress(0)
    const step = 50 // update every 50ms
    let elapsed = 0

    progressRef.current = setInterval(() => {
      elapsed += step
      setProgress((elapsed / SLIDE_DURATION) * 100)

      if (elapsed >= SLIDE_DURATION) {
        if (progressRef.current) clearInterval(progressRef.current)
        transitionTo((currentIndex + 1) % banners.length)
      }
    }, step)
  }, [banners.length, currentIndex])

  const transitionTo = useCallback((target: number) => {
    if (isTransitioning) return
    if (progressRef.current) clearInterval(progressRef.current)

    setNextIndex(target)
    setIsTransitioning(true)
    setProgress(0)

    setTimeout(() => {
      setCurrentIndex(target)
      setNextIndex(null)
      setIsTransitioning(false)
    }, TRANSITION_DURATION)
  }, [isTransitioning])

  useEffect(() => {
    if (!isTransitioning && banners.length > 1) {
      startProgress()
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentIndex, isTransitioning, startProgress])

  const goToSlide = (direction: 'next' | 'prev') => {
    if (isTransitioning || banners.length <= 1) return
    const target = direction === 'next'
      ? (currentIndex + 1) % banners.length
      : (currentIndex - 1 + banners.length) % banners.length
    transitionTo(target)
  }

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    transitionTo(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? 'next' : 'prev')
    }
  }

  const current = banners[currentIndex]

  if (loading) {
    return (
      <div className="pt-[72px] px-4 md:px-6">
        <div className="relative h-[50vh] md:h-[55vh] w-full overflow-hidden bg-[#0A0A0A] rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-white/20 border-t-white/60 animate-spin" />
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="pt-[72px] px-4 md:px-6">
    <div
      className="relative h-[50vh] md:h-[55vh] w-full overflow-hidden group rounded-2xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images — crossfade */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="absolute inset-0"
          style={{
            opacity: index === currentIndex ? (isTransitioning ? 0 : 1)
              : index === nextIndex ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            zIndex: index === nextIndex ? 2 : index === currentIndex ? 1 : 0,
          }}
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover"
            style={{
              transform: index === currentIndex && !isTransitioning ? 'scale(1.03)' : 'scale(1)',
              transition: `transform ${SLIDE_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
            }}
          />
        </div>
      ))}

      {/* Cinematic overlay */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.55) 100%)',
      }} />
      {/* Side vignette */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.2) 100%)',
      }} />

      {/* Content — left-aligned editorial style */}
      <div className="absolute inset-0 z-[3] flex items-end">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pb-14 md:pb-16">
          <div
            className="max-w-lg"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
              transition: `all ${TRANSITION_DURATION * 0.6}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {/* Slide counter */}
            {banners.length > 1 && (
              <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 mb-4 font-light">
                {String(currentIndex + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </p>
            )}

            <h1 className="text-2xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] tracking-[-0.01em] text-white playfair mb-3">
              {current.title}
            </h1>

            {current.subtitle && (
              <p className="text-xs md:text-sm font-light tracking-[0.04em] text-white/60 mb-6 leading-relaxed max-w-sm">
                {current.subtitle}
              </p>
            )}

            <button
              className="group/btn inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-white font-medium transition-all duration-500"
            >
              <span className="relative">
                Explore Collection
                <span className="absolute -bottom-0.5 left-0 w-full h-[0.5px] bg-white/50 origin-left transition-transform duration-500 group-hover/btn:scale-x-100 scale-x-75" />
              </span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows — appear on hover, minimal design */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => goToSlide('prev')}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-[4] opacity-0 group-hover:opacity-100 transition-all duration-400 hover:scale-105"
            aria-label="Previous slide"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40">
              <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
          </button>
          <button
            onClick={() => goToSlide('next')}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[4] opacity-0 group-hover:opacity-100 transition-all duration-400 hover:scale-105"
            aria-label="Next slide"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40">
              <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Bottom progress bar + dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-[4]">
          {/* Thin progress line */}
          <div className="h-[2px] w-full bg-white/10 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-white/70 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot indicators inside banner, right-aligned */}
          <div className="absolute bottom-5 right-5 md:right-8 flex items-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className="group/dot p-1"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: index === currentIndex ? '18px' : '5px',
                    height: '5px',
                    background: index === currentIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
