import { useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { PRI, STA, STA_LABEL } from '../tokens'
import Badge from '../components/Badge'
import Btn from '../components/Btn'
import DueChip from '../components/DueChip'

export default function TaskDetail({ taskId, setPage }) {
  const { get, update, remove } = useTasks()
  const task = get(taskId)

  useEffect(() => { if (!task) setPage('tasks') }, [task])
  if (!task) return null

  const ps = PRI[task.priority] || PRI.medium
  const ss = STA[task.status]   || STA.pending

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      remove(task.id)
      setPage('tasks')
    }
  }

  return (
    <div style={{ paddingTop: '62px', maxWidth: '720px', margin: '0 auto', padding: '90px 24px 80px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px', flexWrap: 'wrap', gap: '10px', animation: 'fadeUp .4s ease both' }}>
        <Btn onClick={() => setPage('tasks')} style={{ padding: '7px 16px', fontSize: '13px' }}>← Back</Btn>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn variant="warn"   onClick={() => setPage('edit', task.id)} style={{ padding: '7px 16px', fontSize: '13px' }}>✎ Edit</Btn>
          <Btn variant="danger" onClick={handleDelete}                   style={{ padding: '7px 16px', fontSize: '13px' }}>✕ Delete</Btn>
        </div>
      </div>

      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,.07)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.45)', animation: 'scaleIn .35s ease both' }}>

        <div style={{ padding: '34px 36px 28px', borderBottom: '1px solid rgba(255,255,255,.06)', borderLeft: `4px solid ${ps.color}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle,${ps.glow},transparent 70%)`, filter: 'blur(60px)', top: '-160px', right: '-80px', pointerEvents: 'none', opacity: .6 }} />

          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge bg={ps.bg} color={ps.color} border={ps.border} style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '9.5px' }}>
              {task.priority} priority
            </Badge>
            <Badge bg={ss.bg} color={ss.color} style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '9.5px' }}>
              {STA_LABEL[task.status]}
            </Badge>
            {task.project && <Badge bg="rgba(255,255,255,.04)" color="#5e5e7a" border="rgba(255,255,255,.07)">◈ {task.project}</Badge>}
            <DueChip dueDate={task.dueDate} status={task.status} />
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#e2e2ee', lineHeight: 1.2 }}>
            {task.title}
          </h1>
        </div>

        <div style={{ padding: '28px 36px' }}>

          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '12px', padding: '15px 20px', marginBottom: '26px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#4e4e68', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
            <select
              value={task.status}
              onChange={e => update(task.id, { status: e.target.value })}
              style={{ padding: '8px 14px', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px', fontSize: '13.5px', color: '#e2e2ee', background: '#09090e', cursor: 'pointer', outline: 'none', fontFamily: "'DM Sans', sans-serif", appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="pending"     style={{ background: '#09090e' }}>Pending</option>
              <option value="in-progress" style={{ background: '#09090e' }}>In Progress</option>
              <option value="completed"   style={{ background: '#09090e' }}>Completed</option>
            </select>
          </div>

          {task.description ? (
            <div style={{ marginBottom: '26px' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#3e3e58', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '11px' }}>Description</p>
              <p style={{ fontSize: '14.5px', color: '#8888a0', lineHeight: 1.85, whiteSpace: 'pre-wrap', fontWeight: 300 }}>
                {task.description}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#2e2e48', fontStyle: 'italic', marginBottom: '26px', fontWeight: 300 }}>No description added.</p>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {[
              ['Created',  new Date(task.createdAt).toLocaleString('en-US',{ month:'long', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })],
              ...(task.dueDate ? [['Due Date', new Date(task.dueDate).toLocaleDateString('en-US',{ month:'long', day:'numeric', year:'numeric' })]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#2e2e48', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '76px' }}>{k}</span>
                <span style={{ fontSize: '13px', color: '#4e4e68', fontWeight: 300 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}