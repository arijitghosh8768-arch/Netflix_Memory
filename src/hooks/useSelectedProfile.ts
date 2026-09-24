import { useEffect, useState } from "react"
import { profiles, type Profile } from "../data/profiles"

function useSelectedProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const profileId = localStorage.getItem("our-story-profile")

    if (!profileId) return

    const selectedProfile = profiles.find(item => item.id === profileId)

    if (selectedProfile) {
      setProfile(selectedProfile)
    }
  }, [])

  return profile
}

export default useSelectedProfile
