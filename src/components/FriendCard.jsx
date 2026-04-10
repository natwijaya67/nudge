import { daysSince, formatDate, staleness } from '../utils/dateUtils'

export default function FriendCard({ friend, onClick }) {
  const sorted = [...friend.meetings].sort((a, b) => new Date(b.date) - new Date(a.date))
  const last = sorted[0]
  const hasmeetings = !!last

  const days = hasmeetings ? daysSince(last.date) : null
  const status = hasmeetings ? staleness(days) : 'overdue'

  return (
    <div className={`friend-card ${status}`} onClick={onClick}>
      <div className="card-header">
        <div className="avatar">{friend.name.charAt(0)}</div>
        <div className="card-header-info">
          <h2 className="friend-name">{friend.name}</h2>
          <span className="last-seen">
            {hasmeetings
              ? `Last seen ${days === 0 ? 'today' : `${days}d ago`}`
              : 'No meetups yet'}
          </span>
        </div>
        <div className={`status-dot ${status}`} />
      </div>
      {hasmeetings && (
        <div className="last-activity">
          <span className="meeting-date">{formatDate(last.date)}</span>
          <span className="meeting-note">{last.note}</span>
        </div>
      )}
    </div>
  )
}
