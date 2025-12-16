"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react"
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

export default function HostingPage() {
  const [hostedEvents, setHostedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await api.delete(`/events/${eventId}`)
      setHostedEvents(hostedEvents.filter(event => event._id !== eventId))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete event")
    }
  }

  useEffect(() => {
    const fetchHostedEvents = async () => {
      try {
        const response = await api.get("/events")
        setHostedEvents(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load hosted events")
      } finally {
        setLoading(false)
      }
    }

    fetchHostedEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your events...</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Events I'm Hosting</h1>
            <p className="text-muted-foreground">Manage the events you've created</p>
          </div>
          <Button asChild size="lg">
            <Link href="/events/create">
              Create New Event
            </Link>
          </Button>
        </div>

        {hostedEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No events yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">Create your first event to get started</p>
              <Button asChild>
                <Link href="/events/create">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hostedEvents.map((event) => (
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

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.seatsAvailable} seats available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/events/${event._id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}