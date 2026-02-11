'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  name: string
  category: string
  price: number
  image: string
  gender: 'men' | 'women'
  index?: number
}

export default function ProductCard({ id, name, category, price, image, gender, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/${gender}/product/${id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glass Card Container */}
        <div className="rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isHovered 
              ? '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
              : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}>
          
          {/* Image */}
          <div className="relative overflow-hidden aspect-[3/4]">
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Quick View Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
              style={{ background: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(4px)' }}>
              <button className="px-8 py-3 text-sm tracking-[0.2em] uppercase font-light text-white rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}>
                QUICK VIEW
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <p className="text-xs text-white/40 tracking-wider uppercase mb-2">{category}</p>
            <h3 className="text-sm font-light text-white/90 mb-2 tracking-wide">{name}</h3>
            <p className="text-sm font-medium text-white">&#x09F3;{price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
