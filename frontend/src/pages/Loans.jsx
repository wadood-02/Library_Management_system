import { useEffect, useState } from 'react'
import api from '../api/client'
import Navbar from '../components/Navbar'

function Loans() {
  const [loans, setLoans] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const loadData = () => {
    Promise.all([
      api.get('/loans'),
      api.get('/books'),
      api.get('/members'),
    ])
      .then(([loansRes, booksRes, membersRes]) => {
        setLoans(loansRes.data)
        setBooks(booksRes.data)
        setMembers(membersRes.data)
      })
      .catch(() => setError('Could not load data.'))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleIssue = async (e) => {
    e.preventDefault()
    setActionError('')
    try {
      await api.post('/loans/issue', {
        book_id: Number(selectedBook),
        member_id: Number(selectedMember),
      })
      setSelectedBook('')
      setSelectedMember('')
      loadData()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not issue loan.')
    }
  }

  const handleReturn = async (loanId) => {
    setActionError('')
    try {
      await api.post(`/loans/${loanId}/return`)
      loadData()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not return loan.')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 className="glow-text">Loans</h1>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        <form
          onSubmit={handleIssue}
          className="glass-panel"
          style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '20px', marginTop: '24px', marginBottom: '28px', flexWrap: 'wrap' }}
        >
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
            className="input-field"
            style={{ flex: '1', minWidth: '180px' }}
          >
            <option value="">Select a book</option>
            {books.filter((b) => b.available_copies > 0).map((book) => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            required
            className="input-field"
            style={{ flex: '1', minWidth: '180px' }}
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Issue Loan</button>
        </form>
        {actionError && <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{actionError}</p>}

        <div className="glass-panel" style={{ padding: '8px 0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-glow)' }}>
                <th style={{ padding: '14px 20px', fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>BOOK</th>
                <th style={{ padding: '14px 20px', fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>MEMBER</th>
                <th style={{ padding: '14px 20px', fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>ISSUED</th>
                <th style={{ padding: '14px 20px', fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>DUE</th>
                <th style={{ padding: '14px 20px', fontSize: '12px', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>STATUS</th>
                <th style={{ padding: '14px 20px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid rgba(124, 108, 255, 0.1)' }}>
                  <td style={{ padding: '14px 20px' }}>{loan.book.title}</td>
                  <td style={{ padding: '14px 20px' }}>{loan.member.name}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{loan.issue_date}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{loan.due_date}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {loan.return_date ? (
                      <span style={{ color: 'var(--success)' }}>Returned {loan.return_date}</span>
                    ) : (
                      <span style={{ color: 'var(--warning)' }}>Active</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {!loan.return_date && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        style={{
                          padding: '6px 16px',
                          background: 'transparent',
                          color: 'var(--success)',
                          border: '1px solid var(--success)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Loans