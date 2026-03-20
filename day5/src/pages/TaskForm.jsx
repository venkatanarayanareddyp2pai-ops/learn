import { useState, useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { FIELD_STYLE, LABEL_STYLE, onFocus, onBlur } from '../tokens'
import Btn from '../components/Btn'

const EMPTY = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '', project: '' }

export default function TaskForm({ editId, setPage }) {
  const { add, update, get, projects } = useTasks()
  const [form, setForm] = useState(EMPTY)
  const [err,  setErr]  = useState({})

  useEffect(() => {
    if (editId) {
      const t = get(editId)
      if (t) setForm({ title: t.title, description: t.description || '', priority: t.priority, status: t.status, dueDate: t.dueDate || '', project: t.project || '' })
    }
  }, [editId])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErr(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.title.trim()) { setErr({ title: 'Title is required' }); return }
    if (editId) {
      update(editId, form)
      setPage('detail', editId)
    } else {
      const t = add(form)
      setPage('detail', t.id)
    }
  }

  return (
    <div style={{ paddingTop: '62px', maxWidth: '640px', margin: '0 auto', padding: '90px 24px 80px' }}>

      <Btn onClick={() => setPage(editId ? 'detail' : 'tasks', editId)} style={{ marginBottom: '24px', padding: '7px 16px', fontSize: '13px' }}>
        ← Back
      </Btn>

      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,.07)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.45)', animation: 'scaleIn .35s ease both' }}>

        <div style={{ padding: '32px 36px 26px', borderBottom: '1px solid rgba(255,255,255,.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,138,240,.1),transparent 70%)', filter: 'blur(50px)', top: '-130px', right: '-70px', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5b8af0', marginBottom: '11px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '16px', height: '1.5px', background: '#5b8af0', display: 'block' }}/>
            {editId ? 'Edit Task' : 'New Task'}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#e2e2ee', marginBottom: '5px' }}>
            {editId ? 'Edit Task' : 'Create New Task'}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#4e4e68', fontWeight: 300 }}>
            {editId ? 'Update the details below' : 'Fill in the details to add a task'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          <div>
            <label style={LABEL_STYLE}>Title <span style={{ color: '#f87171' }}>*</span></label>
            <input
              name="title" value={form.title} onChange={handleChange} autoFocus
              placeholder="Clear task title"
              style={{ ...FIELD_STYLE, borderColor: err.title ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.08)', background: err.title ? 'rgba(239,68,68,.05)' : 'rgba(255,255,255,.04)' }}
              onFocus={onFocus} onBlur={onBlur}
            />
            {err.title && <p style={{ fontSize: '11.5px', color: '#f87171', marginTop: '5px', fontFamily: "'JetBrains Mono', monospace" }}>⚠ {err.title}</p>}
          </div>

          <div>
            <label style={LABEL_STYLE}>Description <span style={{ color: '#3e3e58', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '11px' }}>(optional)</span></label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows={4} placeholder="Steps, context, notes…"
              style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.7 }}
              onFocus={onFocus} onBlur={onBlur}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              ['priority', 'Priority', [['high','🔴 High'],['medium','🟡 Medium'],['low','🟢 Low']]],
              ['status',   'Status',   [['pending','Pending'],['in-progress','In Progress'],['completed','Completed']]],
            ].map(([name, label, opts]) => (
              <div key={name}>
                <label style={LABEL_STYLE}>{label}</label>
                <select
                  name={name} value={form[name]} onChange={handleChange}
                  style={{ ...FIELD_STYLE, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
                  onFocus={onFocus} onBlur={onBlur}
                >
                  {opts.map(([v, l]) => <option key={v} value={v} style={{ background: '#111118' }}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={LABEL_STYLE}>Due Date <span style={{ color: '#3e3e58', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '11px' }}>(optional)</span></label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} style={{ ...FIELD_STYLE, colorScheme: 'dark', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Project <span style={{ color: '#3e3e58', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '11px' }}>(optional)</span></label>
              <input name="project" type="text" value={form.project} onChange={handleChange} placeholder="e.g. Website" style={FIELD_STYLE} list="proj-list" onFocus={onFocus} onBlur={onBlur} />
              <datalist id="proj-list">{projects.map(p => <option key={p} value={p} />)}</datalist>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)' }} />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Btn onClick={() => setPage(editId ? 'detail' : 'tasks', editId)} type="button" style={{ padding: '10px 22px' }}>Cancel</Btn>
            <Btn variant="primary" type="submit" style={{ padding: '10px 26px' }}>
              {editId ? 'Save Changes' : 'Create Task'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  )
}