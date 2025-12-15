import { Navigation } from "@/components/navigation"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const events = [
  {
    _id: "1",
    title: "Web Development Workshop",
    description: "Learn modern web development with React and Next.js",
    location: "San Francisco, CA",
    date: new Date("2025-02-15T18:00:00"),
    ticketPrice: 50,
    seatsAvailable: 25,
    registrationDeadline: new Date("2025-02-10"),
    status: "open" as const,
    user: { _id: "1", name: "John Doe" },
  },
  {
    _id: "2",
    title: "Startup Networking Night",
    description: "Connect with fellow entrepreneurs and investors",
    location: "New York, NY",
    date: new Date("2025-02-20T19:00:00"),
    ticketPrice: 0,
    seatsAvailable: 50,
    registrationDeadline: new Date("2025-02-18"),
    status: "open" as const,
    user: { _id: "2", name: "Jane Smith" },
  },
  {
    _id: "3",
    title: "Design Thinking Conference",
    description: "Explore the future of UX design and user research",
    location: "Austin, TX",
    date: new Date("2025-03-05T09:00:00"),
    ticketPrice: 150,
    seatsAvailable: 100,
    registrationDeadline: new Date("2025-02-28"),
    status: "open" as const,
    user: { _id: "3", name: "Mike Johnson" },
  },
  {
    _id: "4",
    title: "AI & Machine Learning Meetup",
    description: "Discuss latest trends in AI and machine learning",
    location: "Seattle, WA",
    date: new Date("2025-02-25T18:30:00"),
    ticketPrice: 25,
    seatsAvailable: 5,
    registrationDeadline: new Date("2025-02-23"),
    status: "open" as const,
    user: { _id: "4", name: "Sarah Williams" },
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Discover Events</h1>
            <p className="text-muted-foreground">Find your next experience from thousands of events</p>
          </div>

          <Button asChild size="lg">
            <Link href="/events/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10" />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}
