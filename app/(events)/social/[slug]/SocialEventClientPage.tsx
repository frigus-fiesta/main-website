// components/events/SocialEventClientPage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from "@/components/Footer-dark-theme";
import Reviews from '@/components/Reviews';
import ImageGallery from '@/components/event/image-gallery';

interface EventData {
  id: number;
  title: string;
  description: string;
  slug: string;
  eventDate: string;
  tagline: string;
  eventStatus: string;
  category: string;
  hostedBy: string;
  venue: string;
  imageGallery: string;
  eventPrice: number;
  ticketPricingList: string;
  importantInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface HostedBy {
  name: string;
  email: string;
  phone: string;
  website: string;
}

export default function SocialEventClientPage({ slug }: { slug: string }) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    fetchEventData();
  }, [slug]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/get-all-events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const result:any = await response.json();
      if (result.success) {
        const foundEvent = result.data.find((e: EventData) => e.slug === slug);
        if (foundEvent) {
          if (foundEvent.category.toLowerCase() === 'social') {
            setEvent(foundEvent);
          } else {
            setError('Event not found in this category');
          }
        } else {
          setError('Event not found');
        }
      } else {
        throw new Error(result.message || 'Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseHostedBy = (hostedByString: string): HostedBy | null => {
    try {
      return JSON.parse(hostedByString);
    } catch {
      return null;
    }
  };

  const parseTicketPricing = (ticketPricingString: string) => {
    try {
      return JSON.parse(ticketPricingString);
    } catch {
      return [];
    }
  };
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto size-32 animate-spin rounded-full border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-xl text-gray-600">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl text-red-500">⚠️</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Event Not Found</h2>
            <p className="mb-4 text-gray-600">
              {error === 'Event not found in this category' 
                ? 'This event exists but is not a social event. Please check the correct category.' 
                : error || 'The event you are looking for does not exist.'}
            </p>
            <button 
              onClick={() => router.back()}
              className="mx-auto flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-white transition-colors hover:bg-yellow-600"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hostedBy = parseHostedBy(event.hostedBy);
  const ticketPricing = parseTicketPricing(event.ticketPricingList);

  return (
    <>
      <Header />
      <div className="relative h-[90vh] overflow-hidden pt-10 md:h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/25.JPG)',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute size-2 rounded-full bg-white opacity-30"
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
            <div className="mb-4">
              <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                Social Event
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="inline-block text-white">
                {event.title}
              </span>
            </h1>
            <p
              className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              {event.tagline}
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              <div className="text-lg text-white">
                <Calendar className="mr-2 inline size-5" />
                {formatDate(event.eventDate)}
              </div>
              {event.venue && (
                <div className="text-lg text-white">
                  <MapPin className="mr-2 inline size-5" />
                  {event.venue}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <div className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">About This Event</h2>
                <p className="text-lg leading-relaxed text-gray-600">
                  {event.description}
                </p>
              </div>
              {event.importantInfo && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                  <h3 className="mb-3 text-xl font-bold text-amber-900">Important Information</h3>
                  <p className="text-amber-800">{event.importantInfo}</p>
                </div>
              )}
              {ticketPricing.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Ticket Pricing</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {ticketPricing.map((ticket: any, index: number) => (
                      <div key={index} className="rounded-xl border border-gray-200 p-4 transition-colors hover:border-yellow-300">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{ticket.type}</h4>
                          <span className="text-2xl font-bold text-yellow-600">
                            ${ticket.price}
                          </span>
                        </div>
                        <button className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg">
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Event Status</h3>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    event.eventStatus === 'upcoming' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.eventStatus.charAt(0).toUpperCase() + event.eventStatus.slice(1)}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{event.category}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="size-5 text-yellow-500" />
                    <span className="text-gray-700">{formatDate(event.eventDate)}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-3">
                      <MapPin className="size-5 text-yellow-500" />
                      <span className="text-gray-700">{event.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-yellow-600">
                      {event.eventPrice === 0 ? 'Free' : `$${event.eventPrice}`}
                    </span>
                  </div>
                </div>
              </div>
              {hostedBy && (
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Organizer</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="size-5 text-yellow-500" />
                      <span className="font-semibold text-gray-700">{hostedBy.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(`tel:${hostedBy.phone}`, '_blank')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <Phone className="size-4" />
                        Call
                      </button>
                      <button 
                        onClick={() => window.open(`mailto:${hostedBy.email}`, '_blank')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <Mail className="size-4" />
                        Email
                      </button>
                    </div>
                    {hostedBy.website && (
                      <button 
                        onClick={() => window.open(hostedBy.website, '_blank')}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg"
                      >
                        <Globe className="size-4" />
                        Visit Website
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
      `}</style>
      {/* Image Gallery Section */}
      <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Event Gallery</h2>
            <p className="text-lg text-gray-600">Explore photos from this amazing event</p>
          </div>
          <ImageGallery slug={event.slug} />
        </div>
      </div>
      {/* Reviews Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What People Say</h2>
            <p className="text-lg text-gray-600">Reviews and testimonials from attendees</p>
          </div>
          <Reviews slug={event.slug} />
        </div>
      </div>
      <Footer />
    </>
  );
}
