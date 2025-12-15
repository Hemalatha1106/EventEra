import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Calendar, MapPin, Users, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-4 py-32 md:py-40 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Now live: Create and host events
            </div>

            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              Discover events that
              <br />
              <span className="text-muted-foreground">inspire connection</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Create unforgettable experiences. Join a community of event organizers and attendees building meaningful
              connections.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/events">Browse Events</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Link href="/events/create">Host an Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">Easy Event Creation</h3>
              <p className="text-pretty text-muted-foreground">
                Set up your event in minutes with our intuitive interface. Manage tickets, deadlines, and attendees
                effortlessly.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">Build Your Community</h3>
              <p className="text-pretty text-muted-foreground">
                Connect with like-minded individuals. Attend events that align with your interests and expand your
                network.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <MapPin className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">Discover Locally</h3>
              <p className="text-pretty text-muted-foreground">
                Find events happening in your area. From workshops to networking sessions, there's something for
                everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-balance text-4xl font-bold md:text-5xl">Ready to create your first event?</h2>
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Join thousands of organizers already using EventHub to bring people together.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">© 2025 EventEra. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
