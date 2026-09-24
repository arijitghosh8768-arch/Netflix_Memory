export interface Profile {
  id: string
  name: string
  image: string
  theme: string
}

export const profiles: Profile[] = [
  {
    id: "person-1",
    name: "PERSON 1",
    image: "/images/profiles/profile-1.webp",
    theme: "rose",
  },

  {
    id: "person-2",
    name: "PERSON 2",
    image: "/images/profiles/profile-2.webp",
    theme: "crimson",
  },

  {
    id: "memory",
    name: "MEMORIES",
    image: "/images/profiles/profile-3.webp",
    theme: "gold",
  },

  {
    id: "story",
    name: "OUR STORY",
    image: "/images/profiles/profile-4.webp",
    theme: "silver",
  },
]
