'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { Database } from '@/lib/types/database.types'

type Dress = Database['public']['Tables']['dresses']['Row']

export default function AdminDressesPage() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDress, setEditingDress] = useState<Dress | null>(null)
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
      const { error } = await supabase
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

  const filteredDresses = dresses.filter((dress) =>
    dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dress.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Dresses</h1>
          <p className="text-gray-600 mt-2">Add, edit, or remove dresses from the catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingDress(null)
            setShowModal(true)
          }}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Dress
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search dresses by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dresses Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDresses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No dresses found. Click "Add New Dress" to get started!
                </td>
              </tr>
            ) : (
              filteredDresses.map((dress) => (
                <tr key={dress.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={dress.image_url}
                      alt={dress.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dress.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {dress.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dress.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dress.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      dress.is_visible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dress.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleVisibility(dress)}
                        className="text-gray-600 hover:text-gray-900"
                        title={dress.is_visible ? 'Hide' : 'Show'}
                      >
                        {dress.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingDress(dress)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dress.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
    color: dress?.color || '',
    size: dress?.size || '',
    price: dress?.price || 0,
    image_url: dress?.image_url || '',
    is_visible: dress?.is_visible ?? true,
    is_featured: dress?.is_featured || false,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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
        alert('Dress updated successfully!')
      } else {
        // Create new dress
        const { error } = await supabase
          .from('dresses')
          .insert([formData])

        if (error) throw error
        alert('Dress added successfully!')
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving dress:', error)
      alert('Failed to save dress: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {dress ? 'Edit Dress' : 'Add New Dress'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dress Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Elegant Evening Gown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/dress.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a direct URL to the dress image</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Wedding">Wedding</option>
                <option value="Evening">Evening</option>
                <option value="Cocktail">Cocktail</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Red, Blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size *
              </label>
              <select
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Add a description..."
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Visible to users</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : dress ? 'Update Dress' : 'Add Dress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
