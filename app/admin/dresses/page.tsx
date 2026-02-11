'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, X } from 'lucide-react'
import { Database } from '@/lib/types/database.types'

type Dress = Database['public']['Tables']['dresses']['Row']

export default function AdminDressesPage() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDress, setEditingDress] = useState<Dress | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchDresses()
  }, [])

  const fetchDresses = async () => {
    try {
      const { data, error } = await supabase
        .from('dresses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDresses(data || [])
    } catch (error) {
      console.error('Error fetching dresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dress?')) return

    try {
      const { error } = await supabase
        .from('dresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      setDresses(dresses.filter((d) => d.id !== id))
      alert('Dress deleted successfully!')
    } catch (error) {
      console.error('Error deleting dress:', error)
      alert('Failed to delete dress')
    }
  }

  const toggleVisibility = async (dress: Dress) => {
    try {
      const { error} = await supabase
        .from('dresses')
        .update({ is_visible: !dress.is_visible })
        .eq('id', dress.id)

      if (error) throw error
      
      setDresses(dresses.map((d) => 
        d.id === dress.id ? { ...d, is_visible: !d.is_visible } : d
      ))
    } catch (error) {
      console.error('Error updating dress:', error)
      alert('Failed to update dress visibility')
    }
  }

  const categories = ['all', ...Array.from(new Set(dresses.map(d => d.category)))]

  const filteredDresses = dresses.filter((dress) => {
    const matchesSearch = dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dress.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || dress.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white tracking-tight mb-2">Manage Dresses</h1>
        <p className="text-white/50 font-light">Add, edit, or remove items from your collection</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Search dresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none transition-colors placeholder:text-white/30"
            style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none transition-colors tracking-wide"
          style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingDress(null)
            setShowModal(true)
          }}
          className="text-white px-6 py-3 rounded-sm transition-colors flex items-center justify-center text-sm tracking-wider uppercase font-medium"
          style={{ background: 'rgba(192, 132, 252, 0.2)', border: '1px solid rgba(192, 132, 252, 0.3)' }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Dress
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-6 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Total Dresses</p>
          <p className="text-3xl font-light text-white">{dresses.length}</p>
        </div>
        <div className="p-6 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Visible</p>
          <p className="text-3xl font-light text-white">{dresses.filter(d => d.is_visible).length}</p>
        </div>
        <div className="p-6 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Categories</p>
          <p className="text-3xl font-light text-white">{categories.length - 1}</p>
        </div>
      </div>

      {/* Dresses Grid */}
      <div className="rounded-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {filteredDresses.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/50 font-light mb-6">No dresses found</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center text-sm text-white hover:underline tracking-wide"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first dress
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.04)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {filteredDresses.map((dress) => (
                  <tr key={dress.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-20 rounded-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                        <img
                          src={dress.image_url}
                          alt={dress.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-light text-white">{dress.name}</div>
                      {dress.is_featured && (
                        <span className="text-xs text-white/50 tracking-wide">Featured</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-white/70 rounded-sm tracking-wide" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)' }}>
                        {dress.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm tracking-wide`}
                        style={dress.is_visible
                          ? { background: 'rgba(74, 222, 128, 0.15)', color: 'rgba(74, 222, 128, 0.8)', border: '1px solid rgba(74, 222, 128, 0.2)' }
                          : { background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
                        }>
                        {dress.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleVisibility(dress)}
                          className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
                          style={{ }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title={dress.is_visible ? 'Hide' : 'Show'}
                        >
                          {dress.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingDress(dress)
                            setShowModal(true)
                          }}
                          className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(dress.id)}
                          className="p-2 text-white/50 hover:text-red-400 rounded-sm transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DressModal
          dress={editingDress}
          onClose={() => {
            setShowModal(false)
            setEditingDress(null)
          }}
          onSuccess={() => {
            fetchDresses()
            setShowModal(false)
            setEditingDress(null)
          }}
        />
      )}
    </div>
  )
}

// Dress Modal Component
function DressModal({
  dress,
  onClose,
  onSuccess,
}: {
  dress: Dress | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: dress?.name || '',
    description: dress?.description || '',
    category: dress?.category || '',
    image_url: dress?.image_url || '',
    price: dress?.price || '',
    color: dress?.color || '',
    size: dress?.size || '',
    gender: dress?.gender || 'women',
    is_visible: dress?.is_visible ?? true,
    is_featured: dress?.is_featured || false,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear', 'Accessories']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (dress) {
        // Update existing dress
        const { error } = await supabase
          .from('dresses')
          .update(formData)
          .eq('id', dress.id)

        if (error) throw error
        alert('✅ Dress updated successfully!')
      } else {
        // Create new dress
        const { error } = await supabase
          .from('dresses')
          .insert([formData])

        if (error) throw error
        alert('✅ Dress added successfully!')
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving dress:', error)
      alert('❌ Failed to save: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(20, 20, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}>
        {/* Header */}
        <div className="p-6 flex justify-between items-center" style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-2xl font-light text-white tracking-tight">
            {dress ? 'Edit Dress' : 'Add New Dress'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              placeholder="Oversized Wool Coat"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors font-mono text-sm placeholder:text-white/30"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              placeholder="https://images.unsplash.com/photo-..."
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-white/70 font-medium">Where to get image URLs:</p>
              <ul className="text-xs text-white/50 font-light space-y-1 ml-4 list-disc">
                <li><strong>Unsplash:</strong> Right-click image → "Copy image address" or use download link</li>
                <li><strong>Your hosting:</strong> Upload to Imgur, Cloudinary, or AWS S3 and copy URL</li>
                <li><strong>Direct link:</strong> Must end in .jpg, .jpeg, .png, or .webp</li>
              </ul>
              <p className="text-xs text-white/70 font-medium mt-2">Example sources:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a 
                  href="https://unsplash.com/s/photos/fashion" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 rounded text-white/70 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  📸 Unsplash Fashion
                </a>
                <a 
                  href="https://imgur.com/upload" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 rounded text-white/70 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  🖼️ Upload to Imgur
                </a>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Gender *
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors resize-none placeholder:text-white/30"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              placeholder="Premium wool blend coat with oversized fit..."
            />
          </div>

          {/* Price, Color, Size Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                Price (BDT) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">৳</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 rounded-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
                  placeholder="990.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                Color
              </label>
              <select
                value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
                style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Beige">Beige</option>
                <option value="Cream">Cream</option>
                <option value="Navy">Navy</option>
                <option value="Camel">Camel</option>
                <option value="Gray">Gray</option>
                <option value="Brown">Brown</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Pink">Pink</option>
                <option value="Yellow">Yellow</option>
                <option value="Purple">Purple</option>
                <option value="Natural">Natural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                Size Range
              </label>
              <select
                value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
                style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                <option value="">Select size range</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XS-S">XS-S</option>
                <option value="S-M">S-M</option>
                <option value="M-L">M-L</option>
                <option value="L-XL">L-XL</option>
                <option value="XS-L">XS-L</option>
                <option value="S-L">S-L</option>
                <option value="M-XL">M-XL</option>
                <option value="S-XL">S-XL</option>
                <option value="XS-XL">XS-XL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-8 pt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-4 h-4 text-purple-400 border-2 border-white/20 rounded-sm focus:ring-0 focus:ring-offset-0 bg-transparent"
              />
              <span className="ml-3 text-sm text-white/70 tracking-wide">Visible to users</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-purple-400 border-2 border-white/20 rounded-sm focus:ring-0 focus:ring-offset-0 bg-transparent"
              />
              <span className="ml-3 text-sm text-white/70 tracking-wide">Featured</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4" style={{ borderTop: '2px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-sm text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-medium"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-white rounded-sm disabled:opacity-50 transition-colors text-sm tracking-wider uppercase font-medium"
              style={{ background: 'rgba(192, 132, 252, 0.2)', border: '1px solid rgba(192, 132, 252, 0.3)' }}
            >
              {loading ? 'Saving...' : dress ? 'Update' : 'Add Dress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
