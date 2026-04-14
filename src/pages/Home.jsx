import { useState } from 'react'
import { useFriends, useSelectedFriend } from '../hooks/useFriends'
import FriendCard from '../components/FriendCard'
import FriendModal from '../components/FriendModal'
import AddMeetupModal from '../components/AddMeetupModal'
import OnboardingModal from '../components/OnboardingModal'

export default function Home() {
  const { friends, saveFriend, deleteFriend } = useFriends()
  const { selected, setSelected } = useSelectedFriend()
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showAddMeetup, setShowAddMeetup] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => friends.length === 0)

  function handleSave(updated) {
    saveFriend(updated)
    setSelected(updated)
  }

  function handleDelete(id) {
    deleteFriend(id)
    setSelected(null)
  }

  function handleMeetupSave({ date, note, friendIds }) {
    friendIds.forEach(id => {
      const friend = friends.find(f => f.id === id)
      if (!friend) return
      saveFriend({
        ...friend,
        meetings: [...friend.meetings, { date, note }],
      })
    })
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
            <button className="add-meetup-btn" onClick={() => setShowAddMeetup(true)}>+ Meetup</button>
            <button className="add-friend-btn" onClick={() => setShowAddFriend(true)}>+ Friend</button>
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
      {showAddFriend && (
        <FriendModal
          friend={null}
          onClose={() => setShowAddFriend(false)}
          onSave={(newFriend) => { saveFriend(newFriend); setShowAddFriend(false) }}
        />
      )}
      {showAddMeetup && (
        <AddMeetupModal
          friends={friends}
          onSave={handleMeetupSave}
          onClose={() => setShowAddMeetup(false)}
        />
      )}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
