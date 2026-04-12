import { useState, useEffect } from 'react'

export default function AddMeetupModal({ friends, onSave, onClose }) {
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function toggleFriend(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSave() {
    if (!date || !note.trim() || selected.size === 0) return
    onSave({ date, note: note.trim(), friendIds: [...selected] })
    onClose()
  }

  const canSave = date && note.trim() && selected.size > 0

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave} disabled={!canSave}>
              Log meetup
            </button>
          </div>
          <div className="modal-header-identity" style={{ paddingBottom: 4 }}>
            <div className="card-header-info" style={{ paddingLeft: 4 }}>
              <h2 className="friend-name">New Meetup</h2>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <p className="timeline-label">Meetup details</p>
          <div className="add-meeting">
            <input
              type="date"
              className="edit-input date-input"
              value={date}
              onChange={e => setDate(e.target.value)}
              autoFocus
            />
            <div className="add-meeting-row">
              <input
                type="text"
                className="edit-input note-input"
                placeholder="What did you do?"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && canSave) handleSave() }}
              />
            </div>
          </div>

          <p className="timeline-label" style={{ marginTop: 24 }}>Who was there?</p>
          {friends.length === 0 ? (
            <p className="empty-friends-msg">No friends added yet.</p>
          ) : (
            <div className="friend-select-list">
              {friends.map(f => (
                <button
                  key={f.id}
                  className={`friend-select-item ${selected.has(f.id) ? 'selected' : ''}`}
                  onClick={() => toggleFriend(f.id)}
                >
                  <div className="friend-select-avatar">{f.name.charAt(0)}</div>
                  <span className="friend-select-name">{f.name}</span>
                  <span className="friend-select-check">{selected.has(f.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
