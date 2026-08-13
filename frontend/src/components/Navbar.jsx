import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#fff' : 'var(--text-muted)',
    textDecoration: 'none',
    marginRight: '28px',
    fontSize: '14.5px',
    fontWeight: 500,
    borderBottom: location.pathname === path ? '2px solid var(--accent)' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'color 0.2s ease',
  })

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px 40px',
      background: 'rgba(10, 10, 18, 0.7)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-glow)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '48px' }}>
        <Logo size={26} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 'bold', fontSize: '18px' }}>
          Shelf<span style={{ color: 'var(--accent)' }}>ly</span>
        </span>
      </span>
      <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
      <Link to="/books" style={linkStyle('/books')}>Books</Link>
      <Link to="/members" style={linkStyle('/members')}>Members</Link>
      <Link to="/loans" style={linkStyle('/loans')}>Loans</Link>
      <Link to="/categories" style={linkStyle('/categories')}>Categories</Link>
      <button
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          color: 'var(--danger)',
          border: '1px solid var(--danger)',
          borderRadius: '8px',
          padding: '7px 16px',
          cursor: 'pointer',
          fontSize: '13px',
          transition: 'box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.boxShadow = '0 0 14px rgba(255, 92, 92, 0.5)'}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar