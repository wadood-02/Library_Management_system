import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'

function Categories() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const isAdmin = localStorage.getItem('role') === 'admin'

  const emptyForm = { name: '', description: '' }
  const [form, setForm] = useState(emptyForm)

  const loadCategories = () => {
    api.get('/categories')
      .then((response) => setCategories(response.data))
      .catch(() => setError('Could not load categories.'))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openNewForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (category) => {
    setForm({ name: category.name, description: category.description || '' })
    setEditingId(category.id)
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form)
      } else {
        await api.post('/categories', form)
      }
      setShowForm(false)
      loadCategories()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Could not save category.')
    }
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${categoryId}`)
      loadCategories()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete category.')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="glow-text">Categories</h1>
          {isAdmin && (
            <button className="btn-primary" onClick={openNewForm}>+ New Category</button>
          )}
        </div>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', marginTop: '20px', marginBottom: '10px' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Category' : 'New Category'}</h3>
            {formError && <p style={{ color: 'var(--danger)' }}>{formError}</p>}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="input-field"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ flex: '2', minWidth: '200px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">Save</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ background: 'transparent', border: '1px solid var(--border-glow)', color: 'var(--text-muted)', borderRadius: '8px', padding: '10px 22px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px',
          marginTop: '28px',
        }}>
          {categories.map((category) => (
            <div key={category.id} className="card-glow">
              <h3 style={{ margin: '0 0 8px 0', fontSize: '17px' }}>{category.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0', fontSize: '14px' }}>
                {category.description || 'No description'}
              </p>
              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEditForm(category)}
                    style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent-glow)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories