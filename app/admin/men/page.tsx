'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, X, Upload } from 'lucide-react'
import { Database } from '@/lib/types/database.types'

type Dress = Database['public']['Tables']['dresses']['Row']

const MEN_CATEGORIES = ['Shirts', 'T-Shirts', 'Jackets', 'Pants', 'Shorts', 'Suits', 'Accessories']

export default function AdminMenPage() {
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
        .eq('gender', 'men')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDresses(data || [])
    } catch (error) {
      console.error('Error fetching men items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('dresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      setDresses(dresses.filter((d) => d.id !== id))
      alert('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const toggleVisibility = async (dress: Dress) => {
    try {
      const { error } = await supabase
        .from('dresses')
        .update({ is_visible: !dress.is_visible })
        .eq('id', dress.id)

      if (error) throw error

      setDresses(dresses.map((d) =>
        d.id === dress.id ? { ...d, is_visible: !d.is_visible } : d
      ))
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update visibility')
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
        <div className="flex items-center gap-3 mb-2">
          <div className="px-3 py-1 rounded-sm text-xs font-medium tracking-wider uppercase" style={{ background: 'rgba(96, 165, 250, 0.15)', color: 'rgba(96, 165, 250, 0.9)', border: '1px solid rgba(96, 165, 250, 0.25)' }}>
            Men
          </div>
        </div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-2">Men&apos;s Collection</h1>
        <p className="text-white/50 font-light">Add, edit, or remove men&apos;s clothing & accessories</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Search men's items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none transition-colors placeholder:text-white/30"
            style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
          />
        </div>

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

        <button
          onClick={() => {
            setEditingDress(null)
            setShowModal(true)
          }}
          className="text-white px-6 py-3 rounded-sm transition-colors flex items-center justify-center text-sm tracking-wider uppercase font-medium"
          style={{ background: 'rgba(96, 165, 250, 0.2)', border: '1px solid rgba(96, 165, 250, 0.3)' }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Men&apos;s Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-6 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Total Items</p>
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

      {/* Items Table */}
      <div className="rounded-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {filteredDresses.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/50 font-light mb-6">No men&apos;s items found</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center text-sm text-white hover:underline tracking-wide"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first men&apos;s item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.04)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {filteredDresses.map((dress) => (
                  <tr key={dress.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-20 rounded-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                        <img src={dress.image_url} alt={dress.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-light text-white">{dress.name}</div>
                      {dress.is_featured && (
                        <span className="text-xs text-blue-400/70 tracking-wide">Featured</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-white/70 rounded-sm tracking-wide" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)' }}>
                        {dress.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/70">৳{dress.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-sm tracking-wide"
                        style={dress.is_visible
                          ? { background: 'rgba(74, 222, 128, 0.15)', color: 'rgba(74, 222, 128, 0.8)', border: '1px solid rgba(74, 222, 128, 0.2)' }
                          : { background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
                        }>
                        {dress.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => toggleVisibility(dress)} className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title={dress.is_visible ? 'Hide' : 'Show'}
                        >
                          {dress.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                        <button onClick={() => { setEditingDress(dress); setShowModal(true) }} className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(dress.id)} className="p-2 text-white/50 hover:text-red-400 rounded-sm transition-colors"
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
        <MenItemModal
          dress={editingDress}
          onClose={() => { setShowModal(false); setEditingDress(null) }}
          onSuccess={() => { fetchDresses(); setShowModal(false); setEditingDress(null) }}
        />
      )}
    </div>
  )
}

// Men Item Modal Component
function MenItemModal({
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
    gender: 'men' as const,
    is_visible: dress?.is_visible ?? true,
    is_featured: dress?.is_featured || false,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(dress?.image_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP, etc.)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    const localPreview = URL.createObjectURL(file)
    setImagePreview(localPreview)
    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `men/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('dress-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('dress-images')
        .getPublicUrl(fileName)

      setFormData({ ...formData, image_url: publicUrl })
      setImagePreview(publicUrl)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image: ' + error.message)
      setImagePreview(dress?.image_url || null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current
      if (input) {
        const dt = new DataTransfer()
        dt.items.add(file)
        input.files = dt.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_url) {
      alert('Please upload a product image')
      return
    }

    setLoading(true)

    try {
      if (dress) {
        const { error } = await supabase
          .from('dresses')
          .update(formData)
          .eq('id', dress.id)

        if (error) throw error
        alert('✅ Item updated successfully!')
      } else {
        const { error } = await supabase
          .from('dresses')
          .insert([formData])

        if (error) throw error
        alert('✅ Item added to Men\'s collection!')
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving item:', error)
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
          <div>
            <h2 className="text-2xl font-light text-white tracking-tight">
              {dress ? 'Edit Men\'s Item' : 'Add Men\'s Item'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase" style={{ background: 'rgba(96, 165, 250, 0.15)', color: 'rgba(96, 165, 250, 0.9)', border: '1px solid rgba(96, 165, 250, 0.25)' }}>
                Men&apos;s Section
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-sm transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Name *</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              placeholder="Slim Fit Oxford Shirt"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Product Image *</label>
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              className="relative rounded-sm overflow-hidden transition-all"
              style={{ border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(255, 255, 255, 0.04)' }}
            >
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain bg-black/20" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-xs text-white rounded-sm tracking-wider uppercase font-medium transition-colors"
                      style={{ background: 'rgba(96, 165, 250, 0.3)', border: '1px solid rgba(96, 165, 250, 0.4)' }}
                    >Replace</button>
                    <button type="button" onClick={() => { setImagePreview(null); setFormData({ ...formData, image_url: '' }); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="px-4 py-2 text-xs text-white rounded-sm tracking-wider uppercase font-medium transition-colors"
                      style={{ background: 'rgba(239, 68, 68, 0.3)', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                    >Remove</button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-blue-400"></div>
                        <p className="text-white/70 text-xs tracking-wider uppercase">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  className="py-10 px-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <Upload className="h-8 w-8 text-white/30 mb-3" />
                  <p className="text-white/50 text-sm mb-1">Click to upload or drag & drop</p>
                  <p className="text-white/30 text-xs">JPEG, PNG, WebP • Max 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            {formData.image_url && (
              <p className="mt-2 text-xs text-white/30 font-mono truncate" title={formData.image_url}>
                ✓ {formData.image_url.split('/').pop()}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Category *</label>
            <select required value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
            >
              <option value="">Select category</option>
              {MEN_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Description</label>
            <textarea rows={3} value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors resize-none placeholder:text-white/30"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              placeholder="Premium cotton slim fit shirt..."
            />
          </div>

          {/* Price, Color, Size */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Price (BDT) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">৳</span>
                <input type="number" required step="0.01" min="0" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 rounded-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
                  placeholder="990.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Color</label>
              <select value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
                style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Navy">Navy</option>
                <option value="Gray">Gray</option>
                <option value="Blue">Blue</option>
                <option value="Brown">Brown</option>
                <option value="Beige">Beige</option>
                <option value="Cream">Cream</option>
                <option value="Camel">Camel</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Olive">Olive</option>
                <option value="Charcoal">Charcoal</option>
                <option value="Khaki">Khaki</option>
                <option value="Maroon">Maroon</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Size Range</label>
              <select value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 rounded-sm text-white focus:outline-none transition-colors"
                style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="S-M">S-M</option>
                <option value="M-L">M-L</option>
                <option value="L-XL">L-XL</option>
                <option value="S-XL">S-XL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-8 pt-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-4 h-4 text-blue-400 border-2 border-white/20 rounded-sm focus:ring-0 focus:ring-offset-0 bg-transparent"
              />
              <span className="ml-3 text-sm text-white/70 tracking-wide">Visible to users</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-blue-400 border-2 border-white/20 rounded-sm focus:ring-0 focus:ring-offset-0 bg-transparent"
              />
              <span className="ml-3 text-sm text-white/70 tracking-wide">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4" style={{ borderTop: '2px solid rgba(255,255,255,0.08)' }}>
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-sm text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-medium"
              style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
            >Cancel</button>
            <button type="submit" disabled={loading || uploading}
              className="px-6 py-3 text-white rounded-sm disabled:opacity-50 transition-colors text-sm tracking-wider uppercase font-medium"
              style={{ background: 'rgba(96, 165, 250, 0.2)', border: '1px solid rgba(96, 165, 250, 0.3)' }}
            >
              {loading ? 'Saving...' : uploading ? 'Uploading...' : dress ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
