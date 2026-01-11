import Link from "next/link";
import { Button } from "@maistro/ui";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">Maistro</div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-20">
        <div className="container text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Validate Your Ideas
            <br />
            <span className="text-primary">Before Building</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Test your business ideas in minutes. Generate landing pages with AI,
            capture signups, and validate demand before writing a single line of code.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Describe Your Idea</h3>
              <p className="text-muted-foreground">
                Tell us about your business idea, target audience, and the problem you solve.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Generate & Publish</h3>
              <p className="text-muted-foreground">
                Our AI creates a compelling landing page. Review, customize, and publish instantly.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Measure Results</h3>
              <p className="text-muted-foreground">
                Track visitors, capture signups, and validate demand with real data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Maistro. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
