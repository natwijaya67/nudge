import { formatDate } from '../utils/dateUtils'

export default function TimelineEntry({ meeting, isLast, onReact }) {
  const { reaction } = meeting

  function toggle(val) {
    onReact(reaction === val ? null : val)
  }

  return (
    <div className="timeline-entry">
      <div className="timeline-marker">
        <div className="dot" />
        {!isLast && <div className="line" />}
      </div>
      <div className="timeline-content">
        <div className="timeline-date-row">
          <span className="meeting-date">{formatDate(meeting.date)}</span>
        </div>
        <div className="note-row">
          <span className="meeting-note">{meeting.note}</span>
          <div className="reactions">
            <button
              className={`reaction-btn up ${reaction === 'up' ? 'active' : ''}`}
              onClick={() => toggle('up')}
              title="Liked it"
            >▲</button>
            <button
              className={`reaction-btn down ${reaction === 'down' ? 'active' : ''}`}
              onClick={() => toggle('down')}
              title="Didn't like it"
            >▼</button>
          </div>
        </div>
      </div>
    </div>
  )
}
