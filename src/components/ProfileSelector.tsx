import { motion } from "framer-motion"
import { profiles, type Profile } from "../data/profiles"
import ProfileCard from "./ProfileCard"

interface ProfileSelectorProps {
  onSelect: (profile: Profile) => void
}

function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  return (
    <div className="w-full max-w-4xl px-6">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <ProfileCard
              profile={profile}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default ProfileSelector
