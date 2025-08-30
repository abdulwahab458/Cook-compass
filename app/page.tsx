"use client"
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 overflow-hidden">

      {/* Background gradient shapes */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply opacity-30 animate-pulse blur-2xl"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply opacity-25 animate-pulse blur-3xl"></div>
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-pink-200 rounded-full opacity-20 animate-bounce-slow blur-xl"></div>
      <div className="absolute left-1/4 bottom-20 w-48 h-48 bg-pink-300 rounded-full opacity-20 animate-spin-slow blur-xl"></div>

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
        
        {/* Text Content */}
        <div className="text-center md:text-left md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-pink-700 leading-tight">
            Cook Compass
          </h1>
          <p className="text-lg md:text-xl text-pink-600">
            Discover, create, and save delicious recipes. Let AI guide your cooking journey and turn your ingredients into culinary masterpieces.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-6">
            <button
              className="px-8 py-4 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition text-lg font-semibold transform hover:scale-105"
              onClick={() => signIn("google", { callbackUrl: "/recipes" })}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full shadow-lg hover:bg-pink-50 transition text-lg font-semibold transform hover:scale-105"
              onClick={() => window.location.href = '#features'}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mb-10 md:mb-0 relative transform hover:scale-105 transition duration-500">
          <Image
            src="/food.png"
            alt="Delicious Food"
            width={600}
            height={500}
            className="rounded-3xl shadow-2xl"
          />
          {/* Glow & highlights */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-300 rounded-full opacity-30 animate-pulse blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400 rounded-full opacity-25 animate-pulse blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce-slow blur-xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {[
          { title: "Search Recipes", desc: "Quickly find recipes based on ingredients you already have." },
          { title: "AI Recipe Generator", desc: "Generate unique recipes personalized to your taste." },
          { title: "Save Favorites", desc: "Keep your favorite recipes in one place and share them with friends." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-lg p-8 text-center hover:scale-105 transition transform relative">
            <h3 className="text-2xl font-bold text-pink-600 mb-2">{feature.title}</h3>
            <p className="text-pink-500">{feature.desc}</p>
            {/* Tiny soft highlights */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute bottom-2 left-3 w-3 h-3 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center py-20 bg-pink-50 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-6">
          Ready to Cook Something Amazing?
        </h2>
        <button
          className="px-12 py-5 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition text-xl font-semibold transform hover:scale-105"
          onClick={() => signIn("google", { callbackUrl: "/recipes" })}
        >
          Start Your Culinary Journey
        </button>
      </div>

    </div>
  );
}