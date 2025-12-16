"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import api from "@/lib/api"

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
  user?: {
    _id: string
    name: string
  }
}

export default function RegisteredPage() {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await api.get("/events/registered")
        setRegisteredEvents(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load registered events")
      } finally {
        setLoading(false)
      }
    }

    fetchRegisteredEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading registered events...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Events I'm Registered For</h1>
          <p className="text-muted-foreground">Events you've signed up to attend</p>
        </div>

        {registeredEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No registered events</h3>
              <p className="mb-6 text-sm text-muted-foreground">Browse events and register for ones you like</p>
              <Button asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registeredEvents.map((event) => (
              <Card key={event._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant={event.status === "open" ? "default" : "secondary"}>{event.status}</Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(event.date), "MMM dd, yyyy • h:mm a")}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button size="sm" asChild>
                    <Link href={`/events/${event._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}