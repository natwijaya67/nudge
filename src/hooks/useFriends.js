import { useState } from 'react'
import initialFriends from '../data/friends'
import { daysSince } from '../utils/dateUtils'

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

// Returns the nearest upcoming meeting, or null
function nextMeeting(friend) {
  return friend.meetings
    .filter(m => daysSince(m.date) < 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] ?? null
}

// Returns the most recent past meeting, or null
function lastMeeting(friend) {
  return friend.meetings
    .filter(m => daysSince(m.date) >= 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] ?? null
}

export function useFriends() {
  const [friends, setFriends] = useState(load)

  const sorted = [...friends].sort((a, b) => {
    const aNext = nextMeeting(a)
    const bNext = nextMeeting(b)

    // Friends with upcoming meetings go to the bottom, sorted soonest first
    if (aNext && bNext) return new Date(aNext.date) - new Date(bNext.date)
    if (aNext) return 1
    if (bNext) return -1

    // No upcoming meetings — most overdue first
    const aLast = lastMeeting(a)
    const bLast = lastMeeting(b)
    if (!aLast && !bLast) return 0
    if (!aLast) return -1
    if (!bLast) return 1
    return new Date(aLast.date) - new Date(bLast.date)
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
