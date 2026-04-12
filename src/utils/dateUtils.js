export function daysSince(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const local = new Date(year, month - 1, day)
  const diff = Date.now() - local.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function staleness(days) {
  if (days < 0) return 'fresh'   // upcoming meeting
  if (days < 30) return 'fresh'
  if (days < 90) return 'okay'
  if (days < 180) return 'stale'
  return 'overdue'
}

export function daysLabel(days) {
  if (days === 0) return 'today'
  if (days > 0) return `${days}d ago`
  return `in ${Math.abs(days)}d`
}
