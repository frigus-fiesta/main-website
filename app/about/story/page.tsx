"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer-dark-theme";
import Testimonials from "@/components/Testimonials";
import HomeClients from "@/components/Home/HomeClients";

const funFacts = [
  { label: "Years in Business", value: 8 },
  { label: "Events Hosted", value: 1200 },
  { label: "Happy Clients", value: 2500 },
  { label: "Cities Served", value: 12 },
];

const GoldAnimatedBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full overflow-hidden">
    <svg
      className="absolute size-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
    >
      <path d="M -100 500 C 400 1000, 800 100, 1100 450 S 1600 1000, 2020 600" stroke="#FFD700" strokeWidth="2.5" fill="none" opacity="0.18" />
      <path d="M 0 200 C 300 400, 600 100, 900 300 S 1200 500, 1500 200" stroke="#FFB300" strokeWidth="1.5" fill="none" opacity="0.13" />
      <path d="M 200 800 C 500 600, 800 900, 1100 700 S 1400 500, 1700 800" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.13" />
      <path d="M 400 100 C 700 300, 1000 50, 1300 250 S 1600 400, 1900 150" stroke="#FFECB3" strokeWidth="1.5" fill="none" opacity="0.13" />
      <path d="M 100 900 C 400 700, 700 950, 1000 750 S 1300 550, 1600 900" stroke="#FFC107" strokeWidth="1.5" fill="none" opacity="0.13" />
      <circle r="1.2" fill="#FFD700" />
      <circle r="0.8" fill="#FFB300" />
      <circle r="1.1" fill="#FFECB3" />
      <circle r="0.9" fill="#FFC107" />
      <circle r="1" fill="#FFF8E1" />
      <circle cx="200" cy="800" r="80" fill="#FFD700" opacity="0.03" />
      <circle cx="900" cy="250" r="100" fill="#FFB300" opacity="0.03" />
      <circle cx="1500" cy="850" r="60" fill="#FFD700" opacity="0.03" />
      <circle cx="400" cy="150" r="70" fill="#FFECB3" opacity="0.03" />
      <circle cx="1200" cy="600" r="90" fill="#FFC107" opacity="0.03" />
      <circle cx="600" cy="950" r="50" fill="#FFF8E1" opacity="0.03" />
      <circle cx="1700" cy="300" r="75" fill="#FFD700" opacity="0.03" />
    </svg>
  </div>
);

const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let increment = end / 60;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 16);
    
return () => clearInterval(timer);
  }, [value]);
  
return <span>{display.toLocaleString()}</span>;
};

const AboutStoryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GoldAnimatedBackground />
      <Header />
      <div className="relative h-[90vh] overflow-hidden pt-10 md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500 to-yellow-600"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-float absolute size-2 rounded-full bg-yellow-300 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        <div
          className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
              <span className="animate-text-shimmer inline-block text-white">About Us</span>
            </h1>
            <p
              className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Are you looking to add a touch of magic to your events in India? Look no further than Frigus Fiesta! As one of the leading entertainment websites in the country, Frigus Fiesta specializes in organizing a wide array of events and services, ranging from corporate gatherings to electrifying live concerts and vibrant social events. With a presence in key cities like Pune, Hyderabad, Delhi, and Bangalore, Frigus Fiesta brings the joy of celebration to every corner of the nation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-gradient-to-br from-yellow-50 to-amber-100 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {funFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl bg-white/80 p-8 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/30">
              <div className="mb-2 text-4xl font-extrabold text-yellow-500">
                <AnimatedNumber value={fact.value} />
              </div>
              <div className="text-lg font-semibold text-gray-700">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="animate-fade-in-up mb-10 text-4xl font-extrabold text-black md:text-5xl">
              Company <span className="text-yellow-500">History</span>
            </h2>
            <div className="mx-auto mb-10 flex max-w-6xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-16">
              <div className="flex-1">
                <Image src="/assets/aboutus.jpg" alt="Company History" width={800} height={384} className="h-80 w-full rounded-2xl object-cover shadow-xl md:h-96" />
              </div>
              <div className="flex-1 text-left text-gray-700 md:text-lg">
                <p>
                  Founded with a passion for entertainment and a vision for excellence, Frigus Fiesta has grown from humble beginnings into a powerhouse of creativity and innovation. Over the years, we have earned a reputation for delivering unforgettable experiences that leave a lasting impression on our clients and their guests.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-16 mt-40 text-center">
            <h2 className="animate-fade-in-up mb-10 text-4xl font-extrabold text-black md:text-5xl">
              <span className="text-black">Locations</span>
            </h2>
            <div className="mx-auto max-w-4xl text-center text-gray-700 md:text-lg">
              <p>
                With a presence in key cities across India, including Pune, Hyderabad, Delhi, and Bangalore, Frigus Fiesta is strategically positioned to serve clients nationwide. Whether you're planning an event in the heart of the city or a scenic countryside retreat, we have the resources and infrastructure to bring your vision to life.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 py-20">
        <HomeClients />
      </div>
      <div className="relative z-10 py-20">
        <Testimonials />
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-text-shimmer {
          background: linear-gradient(90deg, #fbbf24, #ffffff, #fbbf24);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: text-shimmer 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default AboutStoryPage;
