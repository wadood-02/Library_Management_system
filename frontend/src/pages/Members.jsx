import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'

function Members() {
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const emptyForm = { name: '', email: '', phone: '' }
  const [form, setForm] = useState(emptyForm)

  const loadMembers = () => {
    api.get('/members')
      .then((response) => setMembers(response.data))
      .catch(() => setError('Could not load members.'))
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const openNewForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (member) => {
    setForm({ name: member.name, email: member.email, phone: member.phone || '' })
    setEditingId(member.id)
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      if (editingId) {
        await api.put(`/members/${editingId}`, form)
      } else {
        await api.post('/members', form)
      }
      setShowForm(false)
      loadMembers()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Could not save member.')
    }
  }

  const handleDelete = async (memberId) => {
    if (!confirm('Delete this member?')) return
    try {
      await api.delete(`/members/${memberId}`)
      loadMembers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete member.')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="glow-text">Members</h1>
          <button className="btn-primary" onClick={openNewForm}>+ New Member</button>
        </div>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', marginTop: '20px', marginBottom: '10px' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Member' : 'New Member'}</h3>
            {formError && <p style={{ color: 'var(--danger)' }}>{formError}</p>}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="input-field"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ flex: '1', minWidth: '160px' }}
              />
              <input
                className="input-field"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ flex: '1', minWidth: '160px' }}
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
          {members.map((member) => (
            <div key={member.id} className="card-glow">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #5a4fcf)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginBottom: '14px',
                boxShadow: '0 0 14px rgba(124, 108, 255, 0.4)',
              }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '17px' }}>{member.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0', fontSize: '13.5px' }}>{member.email}</p>
              {member.phone && (
                <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0', fontSize: '13.5px' }}>{member.phone}</p>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => openEditForm(member)}
                  style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent-glow)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Members