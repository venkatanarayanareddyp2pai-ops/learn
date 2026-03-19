import { memo } from 'react'
import { useTasks } from '../context/TaskContext'
import { PRI, STA, STA_LABEL } from '../tokens'
import Badge from './Badge'
import Btn from './Btn'
import DueChip from './DueChip'

const TaskCard = memo(function TaskCard({ task, onView, onEdit }) {
  const { update, remove } = useTasks()
  const ps   = PRI[task.priority] || PRI.medium
  const ss   = STA[task.status]   || STA.pending
  const done = task.status === 'completed'

  return (
    <div
      onClick={() => onView(task.id)}
      style={{
        background: '#111118',
        border: `1px solid rgba(255,255,255,.07)`,
        borderLeft: `3px solid ${ps.color}`,
        borderRadius: '14px', padding: '18px 18px 14px',
        cursor: 'pointer', animation: 'fadeUp .3s ease both',
        transition: 'border-color .22s, transform .22s, box-shadow .22s',
        opacity: done ? .55 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(91,138,240,.3)'
        e.currentTarget.style.transform   = 'translateY(-2px)'
        e.currentTarget.style.boxShadow   = '0 8px 28px rgba(0,0,0,.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'
        e.currentTarget.style.transform   = ''
        e.currentTarget.style.boxShadow   = ''
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '9px' }}>
        <h3 style={{
          flex: 1, fontSize: '14.5px', fontWeight: 600,
          fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em',
          color: done ? '#3e3e58' : '#e2e2ee',
          textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3,
        }}>
          {task.title}
        </h3>
        <Badge bg={ps.bg} color={ps.color} border={ps.border}
          style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {task.priority}
        </Badge>
      </div>

      {task.description && (
        <p style={{
          fontSize: '12.5px', color: '#4e4e68', lineHeight: 1.65,
          marginBottom: '11px', fontWeight: 300,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '13px' }}>
        <Badge bg={ss.bg} color={ss.color}>{STA_LABEL[task.status]}</Badge>
        {task.project && (
          <Badge bg="rgba(255,255,255,.04)" color="#5e5e7a" border="rgba(255,255,255,.07)">
            ◈ {task.project}
          </Badge>
        )}
        <DueChip dueDate={task.dueDate} status={task.status} />
      </div>

      <div
        style={{ display: 'flex', gap: '7px', paddingTop: '11px', borderTop: '1px solid rgba(255,255,255,.05)' }}
        onClick={e => e.stopPropagation()}
      >
        <Btn
          variant={done ? 'ghost' : 'success'}
          style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '8px' }}
          onClick={() => update(task.id, { status: done ? 'pending' : 'completed' })}
        >
          {done ? '↩ Undo' : '✓ Done'}
        </Btn>
        <Btn
          variant="warn"
          style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '8px', marginLeft: 'auto' }}
          onClick={() => onEdit(task.id)}
        >
          ✎ Edit
        </Btn>
        <Btn
          variant="danger"
          style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '8px' }}
          onClick={() => { if (window.confirm(`Delete "${task.title}"?`)) remove(task.id) }}
        >
          ✕ Delete
        </Btn>
      </div>
    </div>
  )
})

export default TaskCard