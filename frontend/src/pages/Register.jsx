import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Logo from '../components/Logo'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('http://localhost:8000/auth/register', { username, password, role })
      setSuccess(true)
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegister} className="glass-panel" style={{ padding: '40px', width: '340px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <Logo size={48} />
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: '12px 0 4px 0' }}>
            Shelf<span style={{ color: '#7c6cff' }}>ly</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '1.5px', margin: 0 }}>
            CREATE AN ACCOUNT
          </p>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: 'var(--success)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            Account created! Redirecting to login...
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          style={{ width: '100%', marginBottom: '14px' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          style={{ width: '100%', marginBottom: '14px' }}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
          style={{ width: '100%', marginBottom: '22px' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
          Create Account
        </button>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/" style={{ color: 'var(--accent-glow)' }}>Log in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register