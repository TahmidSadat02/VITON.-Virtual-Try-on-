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
        <div className="relative overflow-hidden rounded-xl bg-[#F5F5F5] aspect-[3/4] mb-4">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Quick View Button */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button className="border-2 border-white text-white px-8 py-3 text-sm tracking-[0.2em] uppercase font-light hover:bg-white hover:text-black transition-all duration-300">
              QUICK VIEW
            </button>
          </div>
        </div>

        <div className="px-2">
          <p className="text-xs text-[#6B6B6B] tracking-wider uppercase mb-2">{category}</p>
          <h3 className="text-sm font-light text-[#0A0A0A] mb-2 tracking-wide">{name}</h3>
          <p className="text-sm font-medium text-[#0A0A0A]">৳{price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
