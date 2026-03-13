import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight font-[Geist]">
            DropPoint
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="btn-secondary text-sm font-[Inter]"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-primary text-sm font-[Inter]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-slate-50 opacity-50 animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Text */}
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight font-[Geist] bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 bg-clip-text text-transparent leading-tight">
              Find What's<br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">Lost.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 font-[Inter] max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Metropolitan University's official Lost & Found. Post, track, connect. Campus recovery made effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-xl">
                🚀 Start Recovering
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Already have account
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <div className="glass-card p-8 rounded-[3rem] shadow-2xl max-w-md hover:scale-105 transition-all duration-500">
              <img 
                src="/Picures/image.jpg" 
                alt="Campus lost & found" 
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento How It Works */}
      <section id="how" className="py-32 -mt-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight font-[Geist] bg-gradient-to-r from-slate-900 to-zinc-900 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 font-[Inter] max-w-2xl mx-auto">
              Three simple steps to recover what's yours
            </p>
          </div>

          <div className="bento-grid gap-8 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="bento-lg bento-item group hover:bg-indigo-50/50">
              <div className="text-6xl font-black text-indigo-600 mb-6 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-3xl font-black tracking-tight font-[Geist] mb-6 text-slate-900">Post Your Item</h3>
              <p className="text-lg text-slate-600 font-[Inter] leading-relaxed">Lost or found? Snap a photo, add details, post instantly.</p>
            </div>

            {/* Card 2 */}
            <div className="bento-item group hover:bg-emerald-50/50">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-black tracking-tight font-[Geist] mb-4 text-slate-900">Get Instant Matches</h3>
              <p className="text-lg text-slate-600 font-[Inter]">Campus network connects you automatically. Real-time notifications.</p>
            </div>

            {/* Card 3 */}
            <div className="bento-xl bento-item border-2 border-dashed border-indigo-200 group hover:border-indigo-400">
              <div className="flex items-center gap-6">
                <div className="text-6xl">✅</div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight font-[Geist] mb-4 text-slate-900">Recover Safely</h3>
                  <p className="text-lg text-slate-600 font-[Inter]">Chat securely, arrange meetup, mark resolved. Zero hassle.</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bento-item group hover:bg-orange-50/50">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="text-2xl font-black tracking-tight font-[Geist] mb-4 text-slate-900">Mobile First</h3>
              <p className="text-lg text-slate-600 font-[Inter]">Works perfectly on phone. Bottom nav, swipe gestures.</p>
            </div>

            <div className="bento-item row-span-2 group hover:bg-purple-50/50">
              <h3 className="text-3xl font-black tracking-tight font-[Geist] mb-6 text-slate-900">Campus Verified</h3>
              <p className="text-lg text-slate-600 font-[Inter] mb-8 leading-relaxed">Built for Metropolitan University students. Official platform.</p>
              <Link to="/register" className="btn-primary w-full justify-center">
                Join 5000+ Students
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Glass Reviews */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight font-[Geist] bg-gradient-to-r from-slate-900 to-zinc-900 bg-clip-text text-transparent mb-6">
                Trusted by Campus
              </h3>
              <p className="text-xl text-slate-600 font-[Inter] leading-relaxed mb-8">
                "Recovered my laptop in 24h. Life-changing app."
              </p>
              <div className="flex gap-6 text-sm font-[Inter] text-slate-500">
                <span>— CSE 59th Batch</span>
                <span>•</span>
                <span>⭐ 4.9/5 (2.3k)</span>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Samia Jahan', text: 'Lost ID found same day!', role: '59th Batch' },
                { name: 'Ilham Yuda', text: 'Inspiring student project.', role: '58th Batch' },
                { name: 'Nishat Tasnim', text: 'Solved real campus problems.', role: '58th Batch' },
              ].map((review, i) => (
                <div key={i} className="glass-card p-8 hover:shadow-xl transition-all hover:-translate-y-2">
                  <p className="text-lg text-slate-700 font-[Inter] mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {review.name.slice(0,1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-[Geist]">{review.name}</h4>
                      <p className="text-sm text-slate-500">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-zinc-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/2000/400')] opacity-5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="glass-card bg-white/20 backdrop-blur-xl p-12 rounded-3xl max-w-2xl mx-auto mb-12">
            <h3 className="text-4xl font-black tracking-tight font-[Geist] mb-6 text-white drop-shadow-lg">
              Ready to recover?
            </h3>
            <p className="text-xl text-slate-200 font-[Inter] mb-8 leading-relaxed">
              Join Metropolitan University's lost & found revolution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-white/20 text-white border-white/30 backdrop-blur-md px-10 py-4 text-lg shadow-2xl hover:shadow-3xl">
                🚀 Create Account
              </Link>
            </div>
          </div>
          <p className="text-lg text-slate-400 font-[Inter] mb-8">&copy; 2026 DropPoint. Metropolitan University.</p>
        </div>
      </footer>
    </div>
  );
}

