import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50 px-6 py-4">
        <div className="container flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Sampark 2026
          </Link>
          <div className="flex gap-4 md:gap-6 items-center">
            <Link href="/themes" className="hidden md:block hover:text-primary transition-colors">
              Themes
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary px-4 md:px-6 py-2 text-sm md:text-base">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="container text-center mt-10 md:mt-20">
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6">
            Connect. <span className="gradient-text">Innovate.</span> Evolve.
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join the biggest tech event of the year hosted by IEEE.
            Experience the future of technology and networking at Sampark 2026.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="btn btn-primary text-lg px-8 py-3 w-full sm:w-auto text-center">
              Get Your Ticket
            </Link>
            <Link href="/themes" className="btn btn-outline text-lg px-8 py-3 w-full sm:w-auto text-center">
              Explore Themes
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mt-32 grid md:grid-cols-3 gap-8">
          <div className="glass p-8">
            <h3 className="text-2xl font-bold mb-4 text-primary">Smart Networking</h3>
            <p className="text-gray-400">
              Use our NFC-enabled badges to instantly connect with peers and dignitaries.
              Track your connections in real-time.
            </p>
          </div>
          <div className="glass p-8">
            <h3 className="text-2xl font-bold mb-4 text-secondary">Diverse Themes</h3>
            <p className="text-gray-400">
              Explore a wide range of technological themes and showcase your innovative solutions.
            </p>
          </div>
          <div className="glass p-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Interactive Portal</h3>
            <p className="text-gray-400">
              Manage your profile, view connection stats, and unlock exclusive content through your personal dashboard.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-glass-border py-8 mt-20 text-center text-gray-500">
        <p>© 2026 IEEE Student Branch. All rights reserved.</p>
      </footer>
    </div>
  );
}
