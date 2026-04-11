export function daysSince(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const local = new Date(year, month - 1, day)
  const diff = Date.now() - local.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function staleness(days) {
  if (days < 30) return 'fresh'
  if (days < 90) return 'okay'
  if (days < 180) return 'stale'
  return 'overdue'
}
