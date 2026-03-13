import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="mx-auto flex items-center">
          {/* Left: Logo */}
          <div className="px-6 pl-12 py-2">
            <Link to="/" className="text-4xl font-bold italic text-black font-sans">
              DropPoint
            </Link>
          </div>

          {/* Right: Menu */}
          <div className="flex items-center space-x-6 bg-gray-100 px-16 py-8 rounded-l-full ml-auto">
            <a href="#how" className="text-gray-700 hover:text-black hover:text-xl font-semibold transition">
              How It Works
            </a>
            <Link to="/login" className="text-black hover:text-white text-xl border border-black px-4 py-2 rounded hover:bg-black transition">
              Login
            </Link>
            <Link to="/register" className="text-black font-semibold text-xl bg-orange-500 px-4 py-2 rounded font-sans hover:text-white hover:bg-black transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-[calc(100vh-80px)] flex items-center justify-center pt-20">
        <div className="max-w-8xl w-full grid md:grid-cols-2 gap-12 items-center px-12">
          {/* LEFT SIDE: Text */}
          <div>
            <h1 className="text-4xl md:text-8xl font-bold mb-6 font-family:'Raleway' leading-tight">
              Find What's Lost.<br /> Return What's Found.
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-4xl font-family:'Raleway'">
              <span style={{ color: 'orange', fontWeight: 'bold' }}> DropPoint </span> is Metropolitan University's official Lost & Found platform. Post items, track them, and connect with the rightful owners easily.
            </p>
            <Link to="/login" className="inline-block bg-black text-white font-semibold px-8 py-4 rounded-md hover:bg-orange-500 hover:text-xl hover:text-black transition">
              Get Started
            </Link>
          </div>

          {/* RIGHT SIDE: Image */}
          <div className="flex justify-center">
            <img src="/Picures/image.jpg" alt="Lost item" className="w-full max-w-md rounded-lg shadow-2xl" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="max-w-8xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-black mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-200 p-6 rounded-lg shadow-xl hover:shadow-md transition">
              <div className="text-4xl font-bold text-black mb-4">1</div>
              <h3 className="text-3xl font-semibold mb-2 text-orange-500 font-family:'Baloo'">Post an Item</h3>
              <p className="text-black text-2xl font-sans">Found or lost something? Post it with item details, date, and image.</p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-xl hover:shadow-md transition">
              <div className="text-4xl font-bold text-black mb-4">2</div>
              <h3 className="text-3xl font-semibold mb-2 text-orange-500 font-family:'Baloo'">Get Matched</h3>
              <p className="text-black text-2xl font-sans">Others will see your post and reach out if they have it or know about it.</p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-xl hover:shadow-md transition">
              <div className="text-4xl font-bold text-black mb-4">3</div>
              <h3 className="text-3xl font-semibold mb-2 text-orange-500 font-family:'Baloo'">Recover or Return</h3>
              <p className="text-black text-2xl font-sans">Connect and return the item safely through the campus network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 text-black text-center px-4 lg:px-0 mx-auto max-w-full mt-10 mb-10">
        <div className="bg-gray-200 grid grid-cols-1 lg:grid-cols-2 text-black px-7 md:px-16">
          {/* Text Section */}
          <div className="flex justify-center items-center overflow-hidden">
            <div className="w-5/6">
              <h1 className="text-3xl font-extrabold mb-5 mt-10">Meet Our Super Clients</h1>
              <p className="mb-5 text-2xl font-family:'Raleway'">
                DropPoint has become an essential platform for our students.<br /> It helps in quickly recovering lost items and keeps the campus more organized.<br /> We're proud to support it at Metropolitan University
              </p>
            </div>
          </div>

          {/* Reviews Card Section */}
          <div className="relative py-24 hover:scale-105 transform transition duration-300">
            {/* Middle Card */}
            <div className="absolute z-10 top-44 md:top-h-56 w-full md52">
              <div className=":w-3/4 bg-white text-black rounded-lg flex items-center px-5">
                <div>
                  <p className="text-gray-500 mb-5 text-xl">
                    I once lost my ID card and found it within a day using DropPoint. This platform really helps students feel safe and connected.
                  </p>
                  <h1 className="font-bold text-2xl">Samia Jahan</h1>
                  <small className="font-bold text-gray-500">59th Batch Student</small>
                </div>
              </div>
            </div>

            {/* Top Card */}
            <div className="left-8 md:left-32 shadow-xl opacity-40 relative h-56 w-full md:w-3/4 bg-white text-black rounded-lg flex items-center px-5">
              <div>
                <p className="text-gray-500 mb-5">
                  DropPoint is not just useful, it's inspiring. I'm proud of our university students for building something so impactful.
                </p>
                <h1 className="font-bold">Ilham Yuda</h1>
                <small className="font-bold text-gray-500">58th Batch Student</small>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="left-8 md:left-32 opacity-40 top-10 relative h-56 w-full md:w-3/4 bg-white text-black rounded-lg flex items-center px-5">
              <div>
                <p className="text-gray-500 mb-5">
                  An innovative project by CSE students. It proves how small ideas can solve real problems on campus. Highly recommended!
                </p>
                <h1 className="font-bold">Nishat Tasnim</h1>
                <small className="font-bold text-gray-500">58th Batch Student</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-black py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">DropPoint</h1>
          <p className="mb-6 text-xl">An initiative by Metropolitan University students to make campus life easier and more organized. Report lost items, find what others found — all in one place.</p>
          <Link to="/register" className="inline-block text-black font-bold bg-orange-500 px-6 py-2 rounded hover:text-xl hover:bg-gray-300 transition">
            Sign Up
          </Link>
          <p className="text-sm mt-6 text-gray-500">© 2025 DropPoint | Built for Metropolitan University</p>
        </div>
      </footer>
    </div>
  );
}

