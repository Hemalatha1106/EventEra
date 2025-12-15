"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"
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

export default function DashboardPage() {
  const [hostedEvents, setHostedEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostedRes, registeredRes] = await Promise.all([
          api.get("/events"),
          api.get("/events/registered")
        ])
        setHostedEvents(hostedRes.data)
        setRegisteredEvents(registeredRes.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
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
            <h1 className="mb-2 text-4xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and registrations</p>
          </div>

          <Button asChild size="lg">
            <Link href="/events/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="hosted" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hosted">Hosted Events ({hostedEvents.length})</TabsTrigger>
            <TabsTrigger value="registered">Registered Events ({registeredEvents.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="hosted" className="space-y-4">
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
              hostedEvents.map((event) => (
                <Card key={event._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <CardTitle>{event.title}</CardTitle>
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

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="registered" className="space-y-4">
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
              registeredEvents.map((event) => (
                <Card key={event._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <CardTitle>{event.title}</CardTitle>
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

                      <Button size="sm" asChild>
                        <Link href={`/events/${event._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
