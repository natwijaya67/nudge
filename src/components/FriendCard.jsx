import { daysSince, formatDate, staleness, daysLabel } from '../utils/dateUtils'

export default function FriendCard({ friend, onClick }) {
  const upcoming = friend.meetings
    .filter(m => daysSince(m.date) < 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] ?? null

  const lastPast = friend.meetings
    .filter(m => daysSince(m.date) >= 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] ?? null

  const hasMeetings = !!(upcoming || lastPast)
  const featured = upcoming ?? lastPast
  const days = featured ? daysSince(featured.date) : null
  const status = hasMeetings ? staleness(days) : 'overdue'
  const isUpcoming = !!upcoming

  return (
    <div className={`friend-card ${status}`} onClick={onClick}>
      <div className="card-header">
        <div className="avatar">{friend.name.charAt(0)}</div>
        <div className="card-header-info">
          <h2 className="friend-name">{friend.name}</h2>
          <span className="last-seen">
            {!hasMeetings && 'No meetups yet'}
            {hasMeetings && isUpcoming && `Meeting ${daysLabel(days)}`}
            {hasMeetings && !isUpcoming && `Last seen ${daysLabel(days)}`}
          </span>
        </div>
        <div className={`status-dot ${status}`} />
      </div>
      {hasMeetings && (
        <div className={`last-activity ${isUpcoming ? 'upcoming' : ''}`}>
          <span className="meeting-date">{formatDate(featured.date)}</span>
          <span className="meeting-note">{featured.note}</span>
        </div>
      )}
    </div>
  )
}
