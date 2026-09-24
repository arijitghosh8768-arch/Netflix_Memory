import { motion } from "framer-motion"
import type { Profile } from "../data/profiles"

interface ProfileCardProps {
  profile: Profile
  onSelect: (profile: Profile) => void
}

function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(profile)}
      className="group w-32 sm:w-36 md:w-40 text-center cursor-pointer"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-[#181818] border border-white/10 transition-all duration-300 group-hover:border-white/40">
        <img
          src={profile.image}
          alt={profile.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </div>

      <p className="mt-4 text-sm md:text-base text-white/60 transition-colors duration-300 group-hover:text-white">
        {profile.name}
      </p>
    </motion.button>
  )
}

export default ProfileCard
