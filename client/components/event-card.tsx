import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { format } from "date-fns"

interface Event {
  _id: string
  title: string
  description: string
  location: string
  date: string
  ticketPrice: number
  seatsAvailable: number
  registrationDeadline: string
  status: "open" | "closed"
  user: {
    _id: string
    name: string
  }
}

export function EventCard({ event }: { event: Event }) {
  const isLowSeats = event.seatsAvailable < 10

  return (
    <Link href={`/events/${event._id}`}>
      <Card className="group h-full cursor-pointer transition-all hover:border-foreground/20">
        <CardHeader>
          <div className="mb-3 flex items-start justify-between gap-2">
            <Badge variant={event.status === "open" ? "default" : "secondary"}>{event.status}</Badge>
            {isLowSeats && (
              <Badge variant="destructive" className="text-xs">
                Only {event.seatsAvailable} left
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-semibold leading-tight group-hover:text-foreground/80 transition-colors">
            {event.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), "MMM dd, yyyy • h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.seatsAvailable} seats available</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>{event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="secondary">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
