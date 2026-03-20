import Btn from './Btn'

export default function EmptyState({ message, onCreate, showCreate = true }) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 24px',
      background: '#111118', borderRadius: '16px',
      border: '1px solid rgba(255,255,255,.07)',
    }}>
      <div style={{
        width: '60px', height: '60px', borderRadius: '50%',
        margin: '0 auto 18px',
        background: 'linear-gradient(135deg,rgba(91,138,240,.2),rgba(167,139,250,.2))',
        border: '1px solid rgba(91,138,240,.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 28px rgba(91,138,240,.15)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="3" stroke="#5b8af0" strokeWidth="2"/>
        </svg>
      </div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: 700,
        color: '#e2e2ee', marginBottom: '9px', letterSpacing: '-0.03em',
      }}>
        Nothing here yet
      </h3>

      <p style={{ fontSize: '13.5px', color: '#4e4e68', maxWidth: '280px', margin: '0 auto 24px', fontWeight: 300 }}>
        {message || 'Create your first task to get started.'}
      </p>

      {showCreate && onCreate && (
        <Btn variant="primary" onClick={onCreate}>+ Create Task</Btn>
      )}
    </div>
  )
}