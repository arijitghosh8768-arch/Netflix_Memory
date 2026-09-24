import { profiles } from "../data/profiles"

function Profiles() {
  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold">
        Who's Watching?
      </h1>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="text-center"
          >
            <div className="w-28 h-28 rounded-lg bg-[#181818] overflow-hidden">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-3 text-gray-300">
              {profile.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Profiles
