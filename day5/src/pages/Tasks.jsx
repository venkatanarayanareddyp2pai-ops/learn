import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import Btn from '../components/Btn'

const INPUT = {
  padding: '8px 14px', border: '1px solid rgba(255,255,255,.08)',
  borderRadius: '9px', fontSize: '13px', color: '#e2e2ee',
  background: 'rgba(255,255,255,.04)', outline: 'none',
  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
  appearance: 'none', WebkitAppearance: 'none', transition: 'border-color .2s',
}

export default function Tasks({ setPage }) {
  const { tasks, stats, projects } = useTasks()
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('all')
  const [priority, setPriority] = useState('all')
  const [project,  setProject]  = useState('all')

  const filtered = useMemo(() => tasks.filter(t => {
    const q = search.toLowerCase()
    return (
      (!search || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)) &&
      (status   === 'all' || t.status   === status)   &&
      (priority === 'all' || t.priority === priority) &&
      (project  === 'all' || t.project  === project)
    )
  }), [tasks, search, status, priority, project])

  const hasFilter = search || status !== 'all' || priority !== 'all' || project !== 'all'

  const clearFilters = () => { setSearch(''); setStatus('all'); setPriority('all'); setProject('all') }

  return (
    <div style={{ paddingTop: '62px', maxWidth: '960px', margin: '0 auto', padding: '90px 24px 80px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px', animation: 'fadeUp .5s ease both' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5b8af0', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '16px', height: '1.5px', background: '#5b8af0', display: 'block' }}/> Workspace
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#e2e2ee' }}>
            My Tasks
          </h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#4e4e68', marginTop: '5px' }}>
            {stats.total} total · {stats.completed} done
            {stats.overdue > 0 && <span style={{ color: '#f87171', marginLeft: '10px', animation: 'pulse 2s ease infinite' }}>· {stats.overdue} overdue</span>}
          </p>
        </div>
        <Btn variant="primary" onClick={() => setPage('create')} style={{ padding: '10px 22px' }}>
          + New Task
        </Btn>
      </div>

      {stats.overdue > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.22)', borderRadius: '12px', padding: '12px 18px', marginBottom: '18px', animation: 'slideIn .3s ease' }}>
          <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 500 }}>
            ⚠ {stats.overdue} task{stats.overdue > 1 ? 's are' : ' is'} overdue
          </span>
          <button onClick={() => setStatus('pending')} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(239,68,68,.3)', borderRadius: '99px', padding: '3px 12px', fontSize: '12px', color: '#f87171', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Filter pending
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#111118', border: '1px solid rgba(255,255,255,.07)', borderRadius: '14px', padding: '14px 18px', marginBottom: '22px' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#4e4e68', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            type="text" placeholder="Search tasks…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...INPUT, width: '100%', paddingLeft: '34px', cursor: 'text' }}
            onFocus={e => e.target.style.borderColor = 'rgba(91,138,240,.45)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,.08)'}
          />
        </div>

        {[
          [status,   setStatus,   [['all','All Status'],['pending','Pending'],['in-progress','In Progress'],['completed','Completed']]],
          [priority, setPriority, [['all','All Priority'],['high','High'],['medium','Medium'],['low','Low']]],
        ].map(([val, setter, opts], i) => (
          <select key={i} value={val} onChange={e => setter(e.target.value)} style={INPUT}
            onFocus={e => e.target.style.borderColor = 'rgba(91,138,240,.4)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,.08)'}>
            {opts.map(([v, l]) => <option key={v} value={v} style={{ background: '#111118' }}>{l}</option>)}
          </select>
        ))}

        {projects.length > 0 && (
          <select value={project} onChange={e => setProject(e.target.value)} style={INPUT}>
            <option value="all" style={{ background: '#111118' }}>All Projects</option>
            {projects.map(p => <option key={p} value={p} style={{ background: '#111118' }}>{p}</option>)}
          </select>
        )}

        {hasFilter && (
          <button onClick={clearFilters} style={{ ...INPUT, background: 'rgba(239,68,68,.08)', color: '#f87171', border: '1px solid rgba(239,68,68,.2)', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {hasFilter && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#4e4e68', marginBottom: '16px' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {tasks.length === 0 ? (
        <EmptyState onCreate={() => setPage('create')} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No tasks match filters." showCreate={false} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(t => (
            <TaskCard
              key={t.id} task={t}
              onView={() => setPage('detail', t.id)}
              onEdit={() => setPage('edit', t.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}