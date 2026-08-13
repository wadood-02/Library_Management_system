function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid var(--border-glow)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Spinner