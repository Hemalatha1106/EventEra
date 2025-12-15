import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign, Clock, User } from "lucide-react"
import { format } from "date-fns"

// Mock data - replace with actual API call
const event = {
  _id: "1",
  title: "Web Development Workshop",
  description:
    "Join us for an immersive hands-on workshop where you'll learn modern web development using React and Next.js. This comprehensive session covers everything from fundamentals to advanced concepts, perfect for both beginners looking to start their journey and intermediate developers wanting to level up their skills.\n\nWhat you'll learn:\n• React fundamentals and hooks\n• Next.js App Router\n• Server components and actions\n• Building responsive UIs with Tailwind CSS\n• Deployment best practices",
  location: "TechHub SF, 123 Market Street, San Francisco, CA 94103",
  date: new Date("2025-02-15T18:00:00"),
  ticketPrice: 50,
  seatsAvailable: 25,
  registrationDeadline: new Date("2025-02-10"),
  status: "open" as const,
  user: { _id: "1", name: "John Doe", email: "john@example.com" },
}

export default function EventDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Badge variant={event.status === "open" ? "default" : "secondary"}>{event.status}</Badge>
            {event.seatsAvailable < 10 && <Badge variant="destructive">Only {event.seatsAvailable} seats left</Badge>}
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{event.title}</h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Hosted by {event.user.name}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 text-xl font-semibold">About this event</h2>
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">{event.description}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">{format(new Date(event.date), "h:mm a")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Available Seats</p>
                      <p className="text-sm text-muted-foreground">{event.seatsAvailable} seats remaining</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Registration Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.registrationDeadline), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ticket Price</p>
                      <p className="text-lg font-semibold">
                        {event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
