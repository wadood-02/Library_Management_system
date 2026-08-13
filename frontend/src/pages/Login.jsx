import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Logo from '../components/Logo'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username: username,
        password: password,
      })
      const token = response.data.access_token
      localStorage.setItem('token', token)

      const meResponse = await axios.get('http://localhost:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.setItem('role', meResponse.data.role)

      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Check your username and password.')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '40px', width: '340px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <Logo size={48} />
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: '12px 0 4px 0' }}>
            Shelf<span style={{ color: '#7c6cff' }}>ly</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '1.5px', margin: 0 }}>
            SMART LIBRARY MANAGEMENT
          </p>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          style={{ width: '100%', marginBottom: '14px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          style={{ width: '100%', marginBottom: '22px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
          Log In
        </button>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-glow)' }}>Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login