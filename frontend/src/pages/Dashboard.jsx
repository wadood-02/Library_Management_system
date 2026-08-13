import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'
import BookshelfScene from '../components/BookshelfScene'

function Dashboard() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [loans, setLoans] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/books'),
      api.get('/members'),
      api.get('/loans'),
    ])
      .then(([booksRes, membersRes, loansRes]) => {
        setBooks(booksRes.data)
        setMembers(membersRes.data)
        setLoans(loansRes.data)
      })
      .catch(() => setError('Could not load dashboard data.'))
  }, [])

  const activeLoans = loans.filter((l) => !l.return_date).length
  const totalCopies = books.reduce((sum, b) => sum + b.total_copies, 0)
  const availableCopies = books.reduce((sum, b) => sum + b.available_copies, 0)

  const statCardStyle = {
    padding: '24px',
  }

  const statNumberStyle = {
    fontSize: '32px',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold',
  }

  const statLabelStyle = {
    color: 'var(--text-muted)',
    fontSize: '13px',
    letterSpacing: '0.5px',
    marginTop: '4px',
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 className="glow-text">Dashboard</h1>
        <div className="glass-panel" style={{ marginTop: '20px', overflow: 'hidden' }}>
       <BookshelfScene />
      </div>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '28px',
          marginBottom: '36px',
        }}>
          <div className="card-glow" style={statCardStyle}>
            <div style={{ ...statNumberStyle, color: 'var(--accent-glow)' }}>{books.length}</div>
            <div style={statLabelStyle}>TOTAL TITLES</div>
          </div>
          <div className="card-glow" style={statCardStyle}>
            <div style={{ ...statNumberStyle, color: 'var(--success)' }}>{availableCopies}</div>
            <div style={statLabelStyle}>COPIES AVAILABLE</div>
          </div>
          <div className="card-glow" style={statCardStyle}>
            <div style={{ ...statNumberStyle, color: 'var(--warning)' }}>{activeLoans}</div>
            <div style={statLabelStyle}>ACTIVE LOANS</div>
          </div>
          <div className="card-glow" style={statCardStyle}>
            <div style={{ ...statNumberStyle, color: 'var(--accent-cyan)' }}>{members.length}</div>
            <div style={statLabelStyle}>REGISTERED MEMBERS</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          {loans.slice(0, 5).map((loan) => (
            <div key={loan.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid rgba(124, 108, 255, 0.1)',
              fontSize: '14px',
            }}>
              <span>{loan.book.title} → {loan.member.name}</span>
              <span style={{ color: loan.return_date ? 'var(--success)' : 'var(--warning)' }}>
                {loan.return_date ? 'Returned' : 'Active'}
              </span>
            </div>
          ))}
          {loans.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No loan activity yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard