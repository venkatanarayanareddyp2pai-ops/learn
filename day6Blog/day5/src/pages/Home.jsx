import { useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import Btn from '../components/Btn'

export default function Home({ setPage }) {
  const { tasks, stats } = useTasks()
  const pct    = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0
  const recent = useMemo(() => tasks.filter(t => t.status !== 'completed').slice(0, 3), [tasks])

  return (
    <div style={{ paddingTop: '62px' }}>

      <section style={{
        minHeight: '420px', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem)',
      }}>
        {[
          { w:500, h:500, bg:'rgba(91,138,240,.28)',  t:'-120px', r:'-60px', a:'floatA 8s ease-in-out infinite'  },
          { w:360, h:360, bg:'rgba(167,139,250,.18)', b:'0',      l:'-50px', a:'floatB 11s ease-in-out infinite' },
          { w:200, h:200, bg:'rgba(52,211,153,.15)',  t:'35%',    l:'42%',   a:'floatA 14s ease-in-out infinite' },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', width: o.w, height: o.h, borderRadius: '50%',
            background: `radial-gradient(circle,${o.bg},transparent 70%)`,
            filter: 'blur(80px)', top: o.t, right: o.r, bottom: o.b, left: o.l,
            animation: o.a, pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5b8af0',
            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'fadeUp .6s .1s ease both',
          }}>
            <span style={{ width: '18px', height: '1.5px', background: '#5b8af0', display: 'block' }}/>
            Task Management
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 800,
            letterSpacing: '-0.05em', lineHeight: .95, marginBottom: '1.2rem',
            animation: 'fadeUp .7s .2s ease both',
          }}>
            Stay on top of{' '}
            <span style={{
              background: 'linear-gradient(135deg,#5b8af0,#a78bfa 50%,#34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              everything.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(.95rem,1.5vw,1.05rem)', color: '#5e5e7a',
            maxWidth: '460px', marginBottom: '2.5rem', fontWeight: 300,
            animation: 'fadeUp .7s .3s ease both',
          }}>
            Create tasks, set priorities, track progress — all in one dark beautiful workspace.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'fadeUp .7s .4s ease both' }}>
            <Btn variant="primary" onClick={() => setPage('create')} style={{ padding: '12px 28px', fontSize: '15px' }}>
              + Create Task
            </Btn>
            <Btn onClick={() => setPage('tasks')} style={{ padding: '12px 28px', fontSize: '15px' }}>
              View All →
            </Btn>
          </div>
        </div>
      </section>

      {stats.total > 0 && (
        <section style={{ padding: '0 clamp(1.5rem,5vw,4rem) 3rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '14px', marginBottom: '16px' }}>
            {[
              ['Total',       stats.total,      '#5b8af0'],
              ['Pending',     stats.pending,    '#93c5fd'],
              ['In Progress', stats.inProgress, '#fb923c'],
              ['Completed',   stats.completed,  '#34d399'],
            ].map(([label, val, color]) => (
              <div key={label}
                style={{
                  background: '#111118', border: '1px solid rgba(255,255,255,.07)',
                  borderTop: `2px solid ${color}`, borderRadius: '14px',
                  padding: '22px', textAlign: 'center',
                  transition: 'transform .22s, box-shadow .22s', cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
              >
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: '2.4rem', fontWeight: 800,
                  letterSpacing: '-0.05em', color, lineHeight: 1, marginBottom: '7px',
                  textShadow: `0 0 22px ${color}55`,
                }}>{val}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem',
                  color: '#4e4e68', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#111118', border: '1px solid rgba(255,255,255,.07)',
            borderRadius: '14px', padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '11px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4e4e68' }}>
                Overall Progress
              </span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 800, background: 'linear-gradient(135deg,#5b8af0,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {pct}%
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#5b8af0,#a78bfa)', borderRadius: '99px', transition: 'width 1s ease', boxShadow: '0 0 10px rgba(91,138,240,.5)' }} />
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '0 clamp(1.5rem,5vw,4rem) 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#e2e2ee' }}>
            Recent Tasks
          </h2>
          {tasks.length > 0 && (
            <button onClick={() => setPage('tasks')} style={{ background: 'none', border: 'none', color: '#5b8af0', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              See all →
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <EmptyState onCreate={() => setPage('create')} />
        ) : recent.length === 0 ? (
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,.07)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎉</div>
            <p style={{ color: '#4e4e68', fontWeight: 300 }}>All tasks completed!</p>
            <Btn variant="primary" onClick={() => setPage('create')} style={{ marginTop: '18px' }}>Add more</Btn>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '14px' }}>
            {recent.map((t, i) => (
              <div key={t.id} style={{ animation: `fadeUp .5s ${i * 80}ms ease both` }}>
                <TaskCard
                  task={t}
                  onView={() => setPage('detail', t.id)}
                  onEdit={() => setPage('edit', t.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}