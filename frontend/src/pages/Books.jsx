import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'

function Books() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = localStorage.getItem('role') === 'admin'

  const emptyForm = { title: '', author: '', isbn: '', total_copies: 1, category_id: '' }
  const [form, setForm] = useState(emptyForm)

  const loadBooks = () => {
    setLoading(true)
    api.get('/books')
      .then((response) => setBooks(response.data))
      .catch(() => setError('Could not load books.'))
      .finally(() => setLoading(false))
  }

  const loadCategories = () => {
    api.get('/categories')
      .then((response) => setCategories(response.data))
      .catch(() => {})
  }

  useEffect(() => {
    loadBooks()
    loadCategories()
  }, [])

  const openNewForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      total_copies: book.total_copies,
      category_id: book.category_id || '',
    })
    setEditingId(book.id)
    setFormError('')
    setShowForm(true)
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat ? cat.name : null
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? book.category_id === Number(filterCategory) : true
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      const payload = {
        ...form,
        total_copies: Number(form.total_copies),
        category_id: form.category_id ? Number(form.category_id) : null,
      }
      if (editingId) {
        await api.put(`/books/${editingId}`, payload)
      } else {
        await api.post('/books', payload)
      }
      setShowForm(false)
      loadBooks()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Could not save book.')
    }
  }

  const handleDelete = async (bookId) => {
    if (!confirm('Delete this book?')) return
    try {
      await api.delete(`/books/${bookId}`)
      loadBooks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete book.')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="glow-text">Books</h1>
          {isAdmin && (
            <button className="btn-primary" onClick={openNewForm}>+ New Book</button>
          )}
        </div>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <input
            className="input-field"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1', minWidth: '220px' }}
          />
          <select
            className="input-field"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', marginTop: '20px', marginBottom: '10px' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Book' : 'New Book'}</h3>
            {formError && <p style={{ color: 'var(--danger)' }}>{formError}</p>}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="input-field"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                placeholder="ISBN (optional)"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                type="number"
                min="1"
                placeholder="Total copies"
                value={form.total_copies}
                onChange={(e) => setForm({ ...form, total_copies: e.target.value })}
                required
                style={{ width: '140px' }}
              />
              <select
                className="input-field"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                style={{ minWidth: '160px' }}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
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

        {loading ? (
          <Spinner />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px',
            marginTop: '28px',
          }}>
            {filteredBooks.map((book) => (
              <div key={book.id} className="card-glow">
                <h3 style={{ margin: '0 0 8px 0', fontSize: '17px' }}>{book.title}</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 6px 0', fontSize: '14px' }}>{book.author}</p>
                {getCategoryName(book.category_id) && (
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    background: 'rgba(124, 108, 255, 0.15)',
                    color: 'var(--accent-glow)',
                    marginBottom: '12px',
                  }}>
                    {getCategoryName(book.category_id)}
                  </span>
                )}
                <p style={{ margin: '10px 0 16px 0', fontSize: '13.5px' }}>
                  {book.available_copies > 0 ? (
                    <span style={{ color: 'var(--success)' }}>● {book.available_copies} available</span>
                  ) : (
                    <span style={{ color: 'var(--danger)' }}>● Not available</span>
                  )}
                  <span style={{ color: 'var(--text-muted)' }}> / {book.total_copies} total</span>
                </p>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditForm(book)}
                      style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent-glow)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books