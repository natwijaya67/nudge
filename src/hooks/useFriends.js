import { useState } from 'react'
import initialFriends from '../data/friends'

const STORAGE_KEY = 'nudge:friends'

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return initialFriends
  }
}

function persist(friends) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))
}

export function useFriends() {
  const [friends, setFriends] = useState(load)

  const sorted = [...friends].sort((a, b) => {
    const aLast = Math.max(...a.meetings.map(m => new Date(m.date)))
    const bLast = Math.max(...b.meetings.map(m => new Date(m.date)))
    return aLast - bLast
  })

  function saveFriend(updated) {
    setFriends(prev => {
      const exists = prev.some(f => f.id === updated.id)
      const next = exists
        ? prev.map(f => f.id === updated.id ? updated : f)
        : [...prev, updated]
      persist(next)
      return next
    })
  }

  function deleteFriend(id) {
    setFriends(prev => {
      const next = prev.filter(f => f.id !== id)
      persist(next)
      return next
    })
  }

  return { friends: sorted, saveFriend, deleteFriend }
}

export function useSelectedFriend() {
  const [selected, setSelected] = useState(null)
  return { selected, setSelected }
}
