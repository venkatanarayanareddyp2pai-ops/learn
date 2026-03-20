import { useTasks } from '../context/TaskContext'
import Btn from './Btn'

export default function Navbar({ page, setPage }) {
  const { stats } = useTasks()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: '62px', display: 'flex', alignItems: 'center',
      padding: '0 clamp(1rem,4vw,3rem)',
      background: 'rgba(9,9,14,.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
    }}>
      <div
        onClick={() => setPage('home')}
        style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', marginRight: '24px' }}
      >
        <div style={{
          width: '32px', height: '32px', borderRadius: '9px',
          background: 'linear-gradient(135deg,#5b8af0,#a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(91,138,240,.4)', flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
            <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="15" cy="9" r="2" fill="white"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: 800,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg,#5b8af0,#a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          TaskFlow
        </span>
      </div>

      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {[['home', 'Home'], ['tasks', 'Tasks']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              background: page === key ? 'rgba(91,138,240,.15)' : 'transparent',
              border: page === key ? '1px solid rgba(91,138,240,.28)' : '1px solid transparent',
              color: page === key ? '#e2e2ee' : '#6b6b88',
              padding: '6px 14px', borderRadius: '999px',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {label}
            {key === 'tasks' && stats.total > 0 && (
              <span style={{
                background: 'linear-gradient(135deg,#5b8af0,#a78bfa)', color: '#fff',
                fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '99px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {stats.total}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {stats.overdue > 0 && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)',
            borderRadius: '99px', padding: '5px 12px',
            color: '#f87171', fontSize: '12px', fontWeight: 500,
            fontFamily: "'JetBrains Mono', monospace",
            animation: 'pulse 2s ease infinite',
          }}>
            ⚠ {stats.overdue} overdue
          </span>
        )}
        <Btn variant="primary" onClick={() => setPage('create')} style={{ padding: '7px 18px', fontSize: '13px' }}>
          + New Task
        </Btn>
      </div>
    </nav>
  )
}