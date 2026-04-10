import { useState } from 'react'
import { useFriends, useSelectedFriend } from '../hooks/useFriends'
import FriendCard from '../components/FriendCard'
import FriendModal from '../components/FriendModal'

export default function Home() {
  const { friends, saveFriend, deleteFriend } = useFriends()
  const { selected, setSelected } = useSelectedFriend()
  const [showAdd, setShowAdd] = useState(false)

  function handleSave(updated) {
    saveFriend(updated)
    setSelected(updated)
  }

  function handleDelete(id) {
    deleteFriend(id)
    setSelected(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div className="header-top">
            <h1>Nudge</h1>
            <p>Sorted by who you haven't seen in a while</p>
          </div>
          <div className="header-actions">
            <button className="add-friend-btn" onClick={() => setShowAdd(true)}>+ Add</button>
          </div>
        </div>
      </header>
      <div className="card-list">
        {friends.map(f => (
          <FriendCard key={f.id} friend={f} onClick={() => setSelected(f)} />
        ))}
      </div>
      {selected && (
        <FriendModal
          friend={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      {showAdd && (
        <FriendModal
          friend={null}
          onClose={() => setShowAdd(false)}
          onSave={(newFriend) => { saveFriend(newFriend); setShowAdd(false) }}
        />
      )}
    </div>
  )
}
