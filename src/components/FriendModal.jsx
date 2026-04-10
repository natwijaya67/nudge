import { useEffect, useState } from 'react'
import { daysSince, formatDate, staleness } from '../utils/dateUtils'
import TimelineEntry from './TimelineEntry'

const EMPTY_DRAFT = { name: '', meetings: [], newDate: '', newNote: '' }

export default function FriendModal({ friend, onClose, onSave, onDelete }) {
  const isNew = !friend

  const [isEditing, setIsEditing] = useState(isNew)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [draft, setDraft] = useState(() =>
    isNew ? EMPTY_DRAFT : { name: friend.name, meetings: [...friend.meetings], newDate: '', newNote: '' }
  )

  const sorted = isNew ? [] : [...friend.meetings].sort((a, b) => new Date(b.date) - new Date(a.date))
  const last = sorted[0]
  const hasMeetings = !!last
  const days = hasMeetings ? daysSince(last.date) : null
  const status = hasMeetings ? staleness(days) : 'overdue'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isEditing && !isNew) cancelEdit()
        else onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isEditing, isNew, onClose])

  function startEdit() {
    setDraft({ name: friend.name, meetings: sorted.map(m => ({ ...m })), newDate: '', newNote: '' })
    setIsEditing(true)
  }

  function cancelEdit() {
    setDraft(null)
    setIsEditing(false)
    setConfirmDelete(false)
  }

  function saveEdit() {
    if (!draft.name.trim()) return
    const meetings = draft.meetings.filter(m => m.date && m.note)
    onSave({ ...(friend ?? { id: Date.now() }), name: draft.name.trim(), meetings })
    if (!isNew) {
      setIsEditing(false)
      setDraft(null)
    }
  }

  function handleReact(index, value) {
    const meetings = sorted.map((m, i) =>
      i === index ? { ...m, reaction: value } : m
    )
    onSave({ ...friend, meetings })
  }

  function updateMeeting(index, field, value) {
    setDraft(prev => {
      const meetings = [...prev.meetings]
      meetings[index] = { ...meetings[index], [field]: value }
      return { ...prev, meetings }
    })
  }

  function deleteMeeting(index) {
    setDraft(prev => ({ ...prev, meetings: prev.meetings.filter((_, i) => i !== index) }))
  }

  function addMeeting() {
    if (!draft.newDate || !draft.newNote.trim()) return
    setDraft(prev => ({
      ...prev,
      meetings: [{ date: prev.newDate, note: prev.newNote.trim() }, ...prev.meetings],
      newDate: '',
      newNote: '',
    }))
  }

  const displayName = isEditing ? draft.name : friend?.name ?? ''
  const avatarLetter = displayName.charAt(0).toUpperCase() || '?'

  return (
    <div className="modal-backdrop" onClick={isEditing ? undefined : onClose}>
      <div className={`modal ${status}`} onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div className="avatar large">{avatarLetter}</div>
          <div className="card-header-info">
            {isEditing ? (
              <input
                className="edit-name-input"
                value={draft.name}
                onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Friend's name"
                autoFocus={isNew}
              />
            ) : (
              <h2 className="friend-name">{friend.name}</h2>
            )}
            {!isNew && (
              <span className="last-seen">
                {hasMeetings
                  ? `Last seen ${days === 0 ? 'today' : `${days}d ago`} — ${formatDate(last.date)}`
                  : 'No meetups yet'}
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="edit-actions">
              <button className="save-btn" onClick={saveEdit} disabled={!draft.name.trim()}>
                {isNew ? 'Add friend' : 'Save'}
              </button>
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
          ) : (
            <div className="edit-actions">
              <button className="edit-btn" onClick={startEdit}>Edit</button>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>
          )}
        </div>

        <div className="modal-body">
          {isEditing ? (
            <>
              <p className="timeline-label">Add meetup</p>
              <div className="add-meeting">
                <input
                  type="date"
                  className="edit-input date-input"
                  value={draft.newDate}
                  onChange={e => setDraft(prev => ({ ...prev, newDate: e.target.value }))}
                />
                <input
                  type="text"
                  className="edit-input note-input"
                  placeholder="What did you do?"
                  value={draft.newNote}
                  onChange={e => setDraft(prev => ({ ...prev, newNote: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') addMeeting() }}
                />
                <button
                  className="add-btn"
                  onClick={addMeeting}
                  disabled={!draft.newDate || !draft.newNote.trim()}
                >+</button>
              </div>

              {draft.meetings.length > 0 && (
                <>
                  <p className="timeline-label" style={{ marginTop: 24 }}>Meetups</p>
                  <div className="timeline">
                    {draft.meetings.map((m, i) => (
                      <div key={i} className="timeline-entry edit-entry">
                        <div className="timeline-marker">
                          <div className="dot" />
                          {i < draft.meetings.length - 1 && <div className="line" />}
                        </div>
                        <div className="edit-meeting-fields">
                          <input
                            type="date"
                            className="edit-input date-input"
                            value={m.date}
                            onChange={e => updateMeeting(i, 'date', e.target.value)}
                          />
                          <input
                            type="text"
                            className="edit-input note-input"
                            value={m.note}
                            onChange={e => updateMeeting(i, 'note', e.target.value)}
                          />
                          <button
                            className={`reaction-btn up ${m.reaction === 'up' ? 'active' : ''}`}
                            onClick={() => updateMeeting(i, 'reaction', m.reaction === 'up' ? null : 'up')}
                          >▲</button>
                          <button
                            className={`reaction-btn down ${m.reaction === 'down' ? 'active' : ''}`}
                            onClick={() => updateMeeting(i, 'reaction', m.reaction === 'down' ? null : 'down')}
                          >▼</button>
                          <button className="delete-btn" onClick={() => deleteMeeting(i)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {!isNew && (
                <div className="delete-row">
                  {confirmDelete ? (
                    <>
                      <span className="delete-confirm-text">Are you sure?</span>
                      <button className="delete-confirm-btn" onClick={() => onDelete(friend.id)}>Yes, delete</button>
                      <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </>
                  ) : (
                    <button className="delete-friend-btn" onClick={() => setConfirmDelete(true)}>Delete friend</button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="timeline-label">All meetups</p>
              <div className="timeline">
                {sorted.map((m, i) => (
                  <TimelineEntry
                    key={i}
                    meeting={m}
                    isLast={i === sorted.length - 1}
                    onReact={(val) => handleReact(i, val)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
