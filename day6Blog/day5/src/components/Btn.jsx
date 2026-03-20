const VARIANTS = {
  primary: { background: 'linear-gradient(135deg,#5b8af0,#a78bfa)', color: '#fff',     boxShadow: '0 0 22px rgba(91,138,240,.35)' },
  ghost:   { background: 'rgba(255,255,255,.05)',  color: '#b0b0c8', border: '1px solid rgba(255,255,255,.08)' },
  danger:  { background: 'rgba(239,68,68,.09)',    color: '#f87171', border: '1px solid rgba(239,68,68,.22)'  },
  warn:    { background: 'rgba(251,191,36,.09)',   color: '#fbbf24', border: '1px solid rgba(251,191,36,.22)' },
  success: { background: 'rgba(52,211,153,.09)',   color: '#34d399', border: '1px solid rgba(52,211,153,.22)' },
}

export default function Btn({ children, onClick, variant = 'ghost', style = {}, type = 'button', ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.ghost
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '9px 20px', borderRadius: '999px',
        fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
        border: 'none', transition: 'all .22s',
        fontFamily: "'DM Sans', sans-serif",
        ...v, ...style,
      }}
      onMouseEnter={e => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(91,138,240,.5)'
        } else {
          e.currentTarget.style.opacity = '.75'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform  = ''
        e.currentTarget.style.opacity    = '1'
        e.currentTarget.style.boxShadow  = variant === 'primary' ? '0 0 22px rgba(91,138,240,.35)' : ''
      }}
      {...rest}
    >
      {children}
    </button>
  )
}