import React from "react";
import FacilitiesGrid from ".././components/FacilitiesGrid.jsx";
import { Header } from "@/components/Header";
import FAQSection from "@/components/FAQSection";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header className="fixed top-0 left-0 w-full z-50"/>

      {/* Hero Section */}
      <section
        className="relative text-white py-24 text-center flex flex-col items-center justify-center overflow-hidden pt-64"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1383857924/photo/soccer-player-kicking-ball-at-goal.jpg?s=612x612&w=0&k=20&c=3TkpmNldkzM8MA7beQCDs_lb39kE8W6cGXb3k0Zipqk=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-4 text-green-400 drop-shadow-lg">
            Welcome to <span className="text-white">Courtify</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Book and play on premium futsal courts with ease.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-lg cursor-pointer" onClick={()=>navigate("/auth/login")}>
            Book a Court Now
          </button>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-white text-gray-900 py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4 text-green-700">
            Why Choose <span className="text-gray-900">Courtify?</span>
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We connect players with the best futsal courts and seamless bookings.
          </p>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">•</span>
              Instant booking confirmation and reminders
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">•</span>
              Access premium courts across multiple locations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-xl">•</span>
              Secure payment and transparent pricing
            </li>
          </ul>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://www.arenajoondalup.com.au/images/default-source/arena-joondalup/sport/aj9q8743.jpg?sfvrsn=80464edf_7"
            alt="Futsal"
            className="rounded-2xl shadow-xl max-w-md w-full object-cover"
          />
        </div>
      </section>

      {/* Facilities */}
      <main className="p-6 bg-gray-50">
        <FacilitiesGrid />
      </main>

      {/* CTA */}
      <section className="text-center py-16 bg-green-600 text-white rounded-md">
        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
        <p className="mb-6">Join thousands of players already booking their courts.</p>
        <button className="bg-white text-green-700 font-semibold py-3 px-8 rounded-full cursor-pointer hover:bg-gray-200 transition shadow-md">
          Get Started
        </button>
      </section>

      <FAQSection />

      {/* Footer */}
      <footer className="text-center bg-white text-gray-700 py-4 border-t mt-10">
        <p>© {new Date().getFullYear()} Courtify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;