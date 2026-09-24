export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
}

export const timeline: TimelineEvent[] = [
  {
    id: "event-01",
    date: "2025-01-15",
    title: "The Beginning",
    description:
      "The first chapter of our story.",
  },

  {
    id: "event-02",
    date: "2025-02-02",
    title: "First Call",
    description:
      "One conversation that turned into many more.",
  },

  {
    id: "event-03",
    date: "2025-03-14",
    title: "First Adventure",
    description:
      "Our first memorable adventure together.",
  },

  {
    id: "event-04",
    date: "2025-06-20",
    title: "A Special Day",
    description:
      "Another chapter worth remembering.",
  },
]
