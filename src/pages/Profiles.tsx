import { motion } from "framer-motion"
import { useNavigate } from "react-router"

import ProfileSelector from "../components/ProfileSelector"
import type { Profile } from "../data/profiles"

// ponytail: ProfileSelector and ProfileCard could have been 100% inlined into this single file.
// Splitting a pure layout grid into 3 files is classic React boilerplate. 
// I've kept it as requested to match your architecture, but beware of component bloat.

function Profiles() {
  const navigate = useNavigate()

  const handleProfileSelect = (profile: Profile) => {
    localStorage.setItem("our-story-profile", profile.id)
    navigate("/home")
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center">
      <motion.div
        className="mb-12 text-center"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <h1 className="text-3xl md:text-5xl font-medium">
          Who's Watching?
        </h1>

        <p className="mt-3 text-sm md:text-base text-white/40">
          Choose your profile
        </p>
      </motion.div>

      <ProfileSelector onSelect={handleProfileSelect} />
    </main>
  )
}

export default Profiles
