'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database.types'
import { Plus, Edit, Trash2, Eye, EyeOff, X, Upload, GripVertical, Image as ImageIcon } from 'lucide-react'

type Banner = Database['public']['Tables']['banners']['Row']

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [genderFilter, setGenderFilter] = useState<string>('all')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    gender: 'both' as 'men' | 'women' | 'both',
    is_active: true,
    sort_order: 0,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `banner-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. You can also paste an image URL directly.')
    } finally {
      setUploading(false)
    }
  }

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        gender: banner.gender as 'men' | 'women' | 'both',
        is_active: banner.is_active,
        sort_order: banner.sort_order,
      })
      setImagePreview(banner.image_url)
    } else {
      setEditingBanner(null)
      setFormData({
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        gender: 'both',
        is_active: true,
        sort_order: banners.length + 1,
      })
      setImagePreview('')
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.image_url) {
      alert('Title and image are required.')
      return
    }

    try {
      if (editingBanner) {
        // UPDATE
        const { error } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            subtitle: formData.subtitle || null,
            image_url: formData.image_url,
            link_url: formData.link_url || null,
            gender: formData.gender,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBanner.id)

        if (error) throw error
        alert('Banner updated successfully!')
      } else {
        // CREATE
        const { error } = await supabase
          .from('banners')
          .insert({
            title: formData.title,
            subtitle: formData.subtitle || null,
            image_url: formData.image_url,
            link_url: formData.link_url || null,
            gender: formData.gender,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
          })

        if (error) throw error
        alert('Banner created successfully!')
      }

      setShowModal(false)
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Failed to save banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBanners(banners.filter(b => b.id !== id))
      alert('Banner deleted successfully!')
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Failed to delete banner')
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
        .eq('id', banner.id)

      if (error) throw error
      setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
    } catch (error) {
      console.error('Error toggling banner:', error)
      alert('Failed to update banner')
    }
  }

  const filteredBanners = banners.filter(b => {
    if (genderFilter === 'all') return true
    return b.gender === genderFilter || b.gender === 'both'
  })

  const glassCard = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  }

  const inputStyle = {
    border: '2px solid rgba(255,255,255,0.1)',
    background: 'rgba(255, 255, 255, 0.06)',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white tracking-tight mb-2">Manage Banners</h1>
        <p className="text-white/50 font-light">Create, edit, or remove hero banners for men & women sections</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Gender Filter */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none transition-colors tracking-wide"
          style={inputStyle}
        >
          <option value="all">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="both">Both</option>
        </select>

        <div className="flex-1" />

        {/* Add Button */}
        <button
          onClick={() => openModal()}
          className="text-white px-6 py-3 rounded-sm transition-colors flex items-center justify-center text-sm tracking-wider uppercase font-medium hover:scale-[1.02]"
          style={{ background: 'rgba(192, 132, 252, 0.2)', border: '1px solid rgba(192, 132, 252, 0.3)' }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-6 rounded-sm" style={glassCard}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Total Banners</p>
          <p className="text-3xl font-light text-white">{banners.length}</p>
        </div>
        <div className="p-6 rounded-sm" style={glassCard}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Active</p>
          <p className="text-3xl font-light text-white">{banners.filter(b => b.is_active).length}</p>
        </div>
        <div className="p-6 rounded-sm" style={glassCard}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Men Banners</p>
          <p className="text-3xl font-light text-white">{banners.filter(b => b.gender === 'men' || b.gender === 'both').length}</p>
        </div>
        <div className="p-6 rounded-sm" style={glassCard}>
          <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Women Banners</p>
          <p className="text-3xl font-light text-white">{banners.filter(b => b.gender === 'women' || b.gender === 'both').length}</p>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBanners.length === 0 ? (
          <div className="col-span-full py-24 text-center rounded-sm" style={glassCard}>
            <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-light mb-6">No banners found</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center text-sm text-white hover:underline tracking-wide"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first banner
            </button>
          </div>
        ) : (
          filteredBanners.map((banner) => (
            <div key={banner.id} className="rounded-sm overflow-hidden group" style={glassCard}>
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    banner.is_active
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/20">
                    {banner.gender === 'both' ? 'All' : banner.gender}
                  </span>
                </div>

                {/* Sort Order */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                  {banner.sort_order}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-medium text-lg truncate">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-white/60 text-sm truncate">{banner.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    title={banner.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {banner.is_active ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(banner)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
                <p className="text-xs text-white/30">
                  Order: {banner.sort_order}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>

            <h2 className="text-2xl font-light text-white mb-8">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Banner Image *</label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: '200px' }}>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setFormData(prev => ({ ...prev, image_url: '' })) }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-white/40 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">Click to upload or drag & drop</p>
                    <p className="text-white/30 text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploading && (
                  <p className="text-xs text-purple-400 mt-2">Uploading...</p>
                )}

                {/* Or paste URL */}
                <div className="mt-3">
                  <p className="text-xs text-white/30 mb-1">Or paste image URL:</p>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, image_url: e.target.value }))
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none placeholder:text-white/20"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. New Season Arrivals"
                  className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none placeholder:text-white/20"
                  style={inputStyle}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Discover the latest trends"
                  className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none placeholder:text-white/20"
                  style={inputStyle}
                />
              </div>

              {/* Gender & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Target Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'men' | 'women' | 'both' }))}
                    className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none"
                    style={inputStyle}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">Link URL (optional)</label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="e.g. /men or /women"
                  className="w-full px-4 py-3 bg-transparent rounded-sm text-white text-sm focus:outline-none placeholder:text-white/20"
                  style={inputStyle}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.is_active ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${formData.is_active ? 'left-[26px]' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-white/70">{formData.is_active ? 'Active' : 'Inactive'}</span>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-sm text-sm text-white/60 tracking-wider uppercase font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-sm text-sm text-white tracking-wider uppercase font-medium transition-colors hover:scale-[1.02]"
                  style={{ background: 'rgba(192, 132, 252, 0.3)', border: '1px solid rgba(192, 132, 252, 0.4)' }}
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
