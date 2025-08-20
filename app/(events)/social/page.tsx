"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Star, PartyPopper, Sparkles, Calendar, Heart } from 'lucide-react';

import Header from '@/components/Header';
import Footer from "@/components/Footer-dark-theme";

const images = [
  '/assets/21.JPG', '/assets/22.JPG', '/assets/23.JPG', '/assets/24.JPG', '/assets/25.JPG', '/assets/26.JPG', '/assets/27.JPG', '/assets/28.JPG', '/assets/29.JPG', '/assets/31.JPG',
];

const infoCards = [
  {
    icon: PartyPopper,
    title: 'Joyful Celebrations',
    desc: 'From birthdays to anniversaries, we create magical moments for every occasion.'
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    desc: 'Every event is unique. We listen, design, and deliver with heart and creativity.'
  },
  {
    icon: Calendar,
    title: 'Stress-Free Planning',
    desc: 'We handle the details—decor, food, entertainment—so you can enjoy the party.'
  }
];

export default function SocialEventsPage() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);
  
  return (
    <>
      <Header />
      <div className="relative h-[90vh] overflow-hidden pt-10 md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500 to-yellow-600"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute size-2 rounded-full bg-yellow-300 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
        <div
          className={`relative z-10 flex h-full items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="max-w-4xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="inline-block text-white">
                Social Events
              </span>
            </h1>
            <p
              className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Celebrate life's special moments—parties, anniversaries, and more. Frigus Fiesta crafts social events that sparkle with joy and connection.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <section className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">Why <span className='text-yellow-500'>Choose Social Events?</span></h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">We make every celebration shine. Discover how we turn your special moments into golden memories.</p>
        </div>
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {infoCards.map((card, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-100 opacity-10 transition-opacity duration-300 group-hover:opacity-20"></div>
              <div className="relative p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg transition-transform duration-300 group-hover:rotate-6">
                  <card.icon className="size-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-amber-900 transition-colors duration-300 group-hover:text-amber-700">{card.title}</h3>
                <p className="text-gray-700">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">Why <span className='text-yellow-500'>Frigus Fiesta?</span></h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">Ready to turn your dreams into golden reality? We're here to make it happen with style, innovation, and unmatched dedication to excellence.</p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-500">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
                <Sparkles className="size-6 text-yellow-500" />
                Our Golden Promise
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">24/7 Premium Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">Fast Response Time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">Expert Social Event Team</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <Users className="size-6 text-yellow-500" />
                <h4 className="text-xl font-bold text-yellow-500">Join Our Social Community</h4>
              </div>
              <p className="mb-4 text-gray-600">Connect with families and friends who trust us to make their celebrations unforgettable.</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-current text-yellow-400" />
                  <span className="font-semibold text-amber-900">4.9/5</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">1,500+ Social Events Hosted</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-yellow-700">Gallery</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={src} alt={`Social Event ${i+1}`} width={400} height={300} className="h-48 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
} 