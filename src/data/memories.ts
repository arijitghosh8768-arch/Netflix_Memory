export interface Memory {
  id: string
  title: string
  category: string
  image: string
  video?: string
  duration?: string
  description: string
  featured?: boolean
}

export const memories: Memory[] = [
  {
    id: "memory-01",
    title: "The Beginning",
    category: "Our Story",
    image: "/images/memories/memory-01.webp",
    video: "/videos/memory-01.mp4",
    duration: "03:24",
    description:
      "The moment where everything started.",
    featured: true,
  },

  {
    id: "memory-02",
    title: "First Adventure",
    category: "Adventures",
    image: "/images/memories/memory-02.webp",
    video: "/videos/memory-02.mp4",
    duration: "04:12",
    description:
      "One of the first adventures we experienced together.",
  },

  {
    id: "memory-03",
    title: "Best Moments",
    category: "Memories",
    image: "/images/memories/memory-03.webp",
    video: "/videos/memory-03.mp4",
    duration: "05:48",
    description:
      "A collection of some of our favorite moments.",
  },

  {
    id: "memory-04",
    title: "The Little Things",
    category: "Special",
    image: "/images/memories/memory-04.webp",
    video: "/videos/memory-04.mp4",
    duration: "02:51",
    description:
      "Sometimes the smallest moments become the biggest memories.",
  },

  {
    id: "memory-05",
    title: "Unforgettable Day",
    category: "Special Memories",
    image: "/images/memories/memory-05.webp",
    video: "/videos/memory-05.mp4",
    duration: "06:17",
    description:
      "A day we will always remember.",
  },

  {
    id: "memory-06",
    title: "Still Writing",
    category: "Our Story",
    image: "/images/memories/memory-06.webp",
    description:
      "Because this story is still being written.",
  },
]
