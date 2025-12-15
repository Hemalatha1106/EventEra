"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    ticketPrice: "",
    seatsAvailable: "",
    registrationDeadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    // TODO: Implement API call to create event
    alert("Event creation will be implemented with backend integration")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details below to create your event</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Provide information about your event to attract attendees</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Web Development Workshop"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event, what attendees will learn or experience..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., 123 Main St, San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Event Time *</Label>
                  <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Ticket Price ($) *</Label>
                  <Input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter 0 for free events</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatsAvailable">Available Seats *</Label>
                  <Input
                    id="seatsAvailable"
                    name="seatsAvailable"
                    type="number"
                    min="1"
                    placeholder="50"
                    value={formData.seatsAvailable}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <Input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">Last date for attendees to register</p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" size="lg" className="flex-1">
                  Create Event
                </Button>
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
