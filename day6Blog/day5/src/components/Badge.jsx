export default function Badge({ bg, color, border, children, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: bg, color,
      border: `1px solid ${border || 'transparent'}`,
      fontSize: '10.5px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '99px',
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}