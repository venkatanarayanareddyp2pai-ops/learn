export const STA = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const STA_LABEL = {
  [STA.TODO]: "To Do",
  [STA.IN_PROGRESS]: "In Progress",
  [STA.DONE]: "Done",
};
export const PRI = {
  high: {
    color:  '#f87171',
    bg:     'rgba(239,68,68,.1)',
    border: 'rgba(239,68,68,.25)',
    glow:   'rgba(239,68,68,.15)',
  },
  medium: {
    color:  '#fbbf24',
    bg:     'rgba(251,191,36,.1)',
    border: 'rgba(251,191,36,.25)',
    glow:   'rgba(251,191,36,.15)',
  },
  low: {
    color:  '#34d399',
    bg:     'rgba(52,211,153,.1)',
    border: 'rgba(52,211,153,.25)',
    glow:   'rgba(52,211,153,.15)',
  },
}
export const FIELD_STYLE = {
  width: '100%', padding: '10px 14px',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: '10px', fontSize: '13.5px',
  color: '#e2e2ee', background: 'rgba(255,255,255,.04)',
  outline: 'none', fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .2s',
}

export const LABEL_STYLE = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace",
  fontSize: '10.5px', textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#4e4e68', marginBottom: '8px',
}

export const onFocus = e => e.target.style.borderColor = 'rgba(91,138,240,.45)'
export const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,.08)'