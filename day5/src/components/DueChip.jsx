import Badge from './Badge'

export default function DueChip({ dueDate, status }) {
  if (!dueDate) return null

  const now  = new Date(new Date().toDateString())
  const due  = new Date(dueDate)
  const days = Math.round((due - now) / 86400000)

  if (status === 'completed')
    return <Badge bg="rgba(52,211,153,.1)" color="#34d399" border="rgba(52,211,153,.22)">✓ {due.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</Badge>

  if (days < 0)
    return <Badge bg="rgba(239,68,68,.1)" color="#f87171" border="rgba(239,68,68,.22)" style={{animation:'pulse 2.4s ease infinite'}}>⚠ Overdue {Math.abs(days)}d</Badge>

  if (days === 0)
    return <Badge bg="rgba(251,191,36,.1)" color="#fbbf24" border="rgba(251,191,36,.22)">⏰ Today</Badge>

  if (days <= 3)
    return <Badge bg="rgba(251,146,60,.1)" color="#fb923c" border="rgba(251,146,60,.22)">⏱ {days}d left</Badge>

  return <Badge bg="rgba(255,255,255,.05)" color="#6b6b88">📅 {due.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</Badge>
}