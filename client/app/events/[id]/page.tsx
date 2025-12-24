"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign, Clock, User } from "lucide-react"
import { format } from "date-fns"
import api from "@/lib/api"

interface Registration {
  user: {
    _id: string
    name?: string
  } | string
  registeredAt: string
  paymentStatus: "pending" | "paid" | "free"
  paymentId?: string
  ticketId?: string
}

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
    registrations: Registration[]   // ✅ Add this

}

interface Participant {
  user: {
    name: string
    email: string
  }
  registeredAt: string
  paymentStatus: string
}

interface User {
  id: string
  name: string
  email: string
}

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [success, setSuccess] = useState("")

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  // Check if the current user is already registered
const [isRegistered, setIsRegistered] = useState(
  currentUser
    ? event?.registrations.some(
        (reg: Registration) => 
          (typeof reg.user === "string" ? reg.user === currentUser.id : reg.user._id === currentUser.id)
      )
    : false
);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userData = localStorage.getItem("user")
        if (userData) {
          setCurrentUser(JSON.parse(userData))
        }

        // Fetch event
        const response = await api.get(`/events/${eventId}`)
        setEvent(response.data)

        // If user is host, fetch participants
        if (userData) {
          const user = JSON.parse(userData)
          if (response.data.user._id === user.id) {
            const participantsResponse = await api.get(`/events/${eventId}/participants`)
            setParticipants(participantsResponse.data)
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchData()
    }
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center py-12">
            <p className="text-red-500">{error || "Event not found"}</p>
          </div>
        </div>
      </div>
    )
  }
  
const handleRegister = async () => {
  if (!event) return;

  setRegistering(true);
  setRegisterError("");
  setSuccess("");

  try {
    if (event.ticketPrice === 0) {
      // Free event
      await api.post(`/events/${event._id}/register-free`);
      setSuccess("Successfully registered for the event 🎉");
      setEvent((prev) =>
        prev ? { ...prev, seatsAvailable: prev.seatsAvailable - 1 } : prev
      );
      setIsRegistered(true);
    } else {
      // Paid event
      // 1️⃣ Create Razorpay order on server
      const { data: orderData } = await api.post(`/events/${event._id}/create-order`);

      const options = {
        key: orderData.key, // Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: event.title,
        description: "Event Ticket",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 2️⃣ Verify payment on backend
            await api.post(`/events/${event._id}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 3️⃣ Update UI
            setSuccess("Successfully registered for the event 🎉");
            setEvent((prev) =>
              prev ? { ...prev, seatsAvailable: prev.seatsAvailable - 1 } : prev
            );
            setIsRegistered(true);
          } catch (err: any) {
            setRegisterError(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
        },
        theme: {
          color: "#2563EB",
        },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  } catch (err: any) {
    setRegisterError(err.response?.data?.message || "Registration failed");
  } finally {
    setRegistering(false);
  }
};


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

            {/* Participants Section - Only for host */}
            {currentUser && event.user._id === currentUser.id && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-xl font-semibold">Registered Participants ({participants.length})</h2>
                  {participants.length === 0 ? (
                    <p className="text-muted-foreground">No participants registered yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{participant.user.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Registered on {format(new Date(participant.registeredAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Badge variant={participant.paymentStatus === "paid" ? "default" : participant.paymentStatus === "free" ? "secondary" : "outline"}>
                            {participant.paymentStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
                        {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
                      </p>
                    </div>
                  </div>
                </div>
                {registerError && (
                <p className="text-sm text-red-500 text-center mb-2">
                  {registerError}
                </p>
              )}

              {success && (
                <p className="text-sm text-green-600 text-center mb-2">
                  {success}
                </p>
              )}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRegister}
                  disabled={registering || isRegistered || event?.seatsAvailable === 0 || event?.status === "closed"}
                >
                  {registering
                    ? "Registering..."
                    : isRegistered
                    ? "Already Registered"
                    : "Register Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
