"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Search, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from "@/components/Footer-dark-theme";

const GoldAnimatedBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full">
    <svg
      className="absolute size-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
    >
      <path
        d="M 0 200 C 300 400, 600 100, 900 300 S 1200 500, 1500 200"
        stroke="#FFD700"
        strokeWidth="2.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 200 800 C 500 600, 800 900, 1100 700 S 1400 500, 1700 800"
        stroke="#FFB300"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 400 100 C 700 300, 1000 50, 1300 250 S 1600 400, 1900 150"
        stroke="#FFECB3"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 100 900 C 400 700, 700 950, 1000 750 S 1300 550, 1600 900"
        stroke="#FFC107"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
    </svg>
  </div>
);

// Interface for API event data
interface ApiEventData {
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

// Interface for transformed event data
interface TransformedEvent {
  id: number;
  title: string;
  type: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  booked: number;
  price: string;
  image: string;
  description: string;
  features: string[];
  slug: string;
  tagline: string;
  eventStatus: string;
}

const ScheduledEventsPage = () => {
  const [selectedService, setSelectedService] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<TransformedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-server.developer-frigus-fiesta.workers.dev/general/get-all-events');
      // const response = await fetch('https://backend-server.developer-frigus-fiesta.workers.dev/general/get-all-events-from-cache');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const result:any = await response.json();
      if (result.success) {
        const transformedEvents = result.data.map((event: ApiEventData) => transformEventData(event));
        setEvents(transformedEvents);
      } else {
        throw new Error(result.message || 'Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformEventData = (apiEvent: ApiEventData): TransformedEvent => {
    const eventDate = new Date(apiEvent.eventDate);
    const date = eventDate.toISOString().split('T')[0];
    const time = eventDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const features = generateFeatures(apiEvent.category, apiEvent.description);

    const { capacity, booked } = generateCapacityAndBooked(apiEvent.category);

    const image = getCategoryImage(apiEvent.category, apiEvent.id);

    return {
      id: apiEvent.id,
      title: apiEvent.title,
      type: apiEvent.category.toLowerCase(),
      category: apiEvent.category,
      date: date,
      time: time,
      location: apiEvent.venue,
      capacity: capacity,
      booked: booked,
      price: `$${apiEvent.eventPrice}`,
      image: image,
      description: apiEvent.description,
      features: features,
      slug: apiEvent.slug,
      tagline: apiEvent.tagline,
      eventStatus: apiEvent.eventStatus
    };
  };

  const generateFeatures = (category: string, description: string): string[] => {
    const categoryLower = category.toLowerCase();
    const features: string[] = [];

    if (categoryLower === 'corporate') {
      features.push('Professional Setup', 'Networking Sessions');
      if (description.toLowerCase().includes('conference')) features.push('Conference Hall');
      if (description.toLowerCase().includes('workshop')) features.push('Workshop Materials');
      if (description.toLowerCase().includes('launch')) features.push('Product Demo');
    } else if (categoryLower === 'live') {
      features.push('Live Performance', 'Sound System');
      if (description.toLowerCase().includes('concert')) features.push('Stage Effects');
      if (description.toLowerCase().includes('music')) features.push('Professional Audio');
      if (description.toLowerCase().includes('jazz')) features.push('Intimate Setting');
    } else if (categoryLower === 'social') {
      features.push('Event Planning', 'Decoration');
      if (description.toLowerCase().includes('wedding')) features.push('Wedding Services');
      if (description.toLowerCase().includes('birthday')) features.push('Party Games');
      if (description.toLowerCase().includes('anniversary')) features.push('Romantic Setup');
    }

    return features.slice(0, 4); // Limit to 4 features
  };

  const generateCapacityAndBooked = (category: string): { capacity: number; booked: number } => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower === 'corporate') {
      const capacity = Math.floor(Math.random() * 500) + 100; // 100-600
      const booked = Math.floor(capacity * (0.6 + Math.random() * 0.3)); // 60-90% booked

      return { capacity, booked };
    } else if (categoryLower === 'live') {
      const capacity = Math.floor(Math.random() * 3000) + 500; // 500-3500

      const booked = Math.floor(capacity * (0.7 + Math.random() * 0.25)); // 70-95% booked
      
      return { capacity, booked };
    } else if (categoryLower === 'social') {
      const capacity = Math.floor(Math.random() * 300) + 50; // 50-350
      const booked = Math.floor(capacity * (0.5 + Math.random() * 0.4)); // 50-90% booked

      return { capacity, booked };
    }

    return { capacity: 200, booked: 150 };
  };

  const getCategoryImage = (category: string, eventId: number): string => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower === 'corporate') {
      const images = ['/assets/1.JPG', '/assets/2.JPG', '/assets/3.JPG', '/assets/4.JPG'];
      
      return images[eventId % images.length];
    } else if (categoryLower === 'live') {
      const images = ['/assets/11.JPG', '/assets/12.JPG', '/assets/13.JPG', '/assets/14.JPG'];
      
      return images[eventId % images.length];
    } else if (categoryLower === 'social') {
      const images = ['/assets/21.JPG', '/assets/22.JPG', '/assets/23.JPG', '/assets/24.JPG'];
      
      return images[eventId % images.length];
    }

    return '/assets/default.jpg';
  };

  const services = [
    { id: 'corporate', name: 'Corporate', icon: '🏢', color: 'from-amber-400 to-yellow-600', path: '/corporate' },
    { id: 'live', name: 'Live', icon: '🎵', color: 'from-purple-400 to-pink-600', path: '/live' },
    { id: 'social', name: 'Social', icon: '🎉', color: 'from-blue-400 to-indigo-600', path: '/social' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesService = selectedService === 'all' || event.type === selectedService;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesService && matchesSearch;
  });

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-amber-500';

    return 'text-green-500';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Corporate': return 'from-amber-400 to-yellow-600';
      case 'Live': return 'from-purple-400 to-pink-600';
      case 'Social': return 'from-blue-400 to-indigo-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleEventClick = (event: TransformedEvent) => {
    window.location.href = `/${event.type}/${event.slug}`;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GoldAnimatedBackground />
      <Header/>
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
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        <div className={`relative z-10 flex h-full items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="animate-text-shimmer inline-block text-white">
                Scheduled Events
              </span>
            </h1>
            <p className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Discover extraordinary experiences crafted for corporate excellence, 
              live entertainment, and unforgettable social celebrations
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <button className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300">
                Explore Events
              </button>
              <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300">
                View Calendar
              </button>
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
          <div className="mb-16 text-center">
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">Our <span className='text-yellow-500'>Event Categories</span></h2>
            <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-3xl text-xl text-gray-600">
              Explore our diverse range of events designed to meet every occasion and requirement
            </p>
          </div>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-fade-in-up group relative cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
                <div className="relative p-8 text-center">
                  <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-black transition-colors duration-300">
                    {service.name} Events
                  </h3>
                  <p className="mb-4 leading-relaxed text-gray-600">
                    Professional {service.name.toLowerCase()} services tailored to create memorable experiences
                  </p>
                  <div className="flex items-center justify-center gap-2 text-amber-600 transition-colors duration-300 group-hover:text-amber-700">
                    <Link href={service.path} className="text-sm font-semibold">Explore More</Link>
                    <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">Upcoming <span className='text-yellow-500'>Events</span></h2>
            <p className="animate-fade-in-up animation-delay-200 text-xl text-gray-600">Browse and book your next unforgettable experience</p>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto size-16 animate-spin rounded-full border-b-2 border-yellow-500"></div>
                <p className="mt-4 text-xl text-gray-600">Loading events...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl text-red-500">⚠️</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Loading Events</h2>
              <p className="mb-4 text-gray-600">{error}</p>
              <button 
                onClick={fetchEventsData}
                className="rounded-lg bg-yellow-500 px-6 py-2 text-white transition-colors hover:bg-yellow-600"
              >
                Try Again
              </button>
            </div>
          )}
          {!loading && !error && (
            <>
              <div className="animate-slide-in-up mb-12 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-col sm:gap-6 lg:flex-row lg:items-center">
                  <div className="w-full lg:flex-1">
                    <div className="group relative">
                      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-amber-500" />
                      <input
                        type="text"
                        placeholder="Search events, locations, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 transition-all duration-300 hover:border-amber-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                  <div className="w-full overflow-x-auto lg:w-auto">
                    <div className="flex min-w-[300px] flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
                      <button
                        onClick={() => setSelectedService('all')}
                        className={`min-w-[120px] flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 sm:text-base ${
                          selectedService === 'all' 
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-400/25' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        All Events
                      </button>
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`min-w-[120px] flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 sm:text-base ${
                            selectedService === service.id 
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-400/25' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span className="mr-1">{service.icon}</span> 
                          {service.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-fade-in-up group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`}></div>
                      <div className={`absolute left-4 top-4 rounded-full bg-gradient-to-r ${getCategoryColor(event.category)} px-3 py-1 text-xs font-semibold text-white shadow-lg`}>
                        {event.category}
                      </div>
                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm transition-all duration-300 group-hover:bg-white">
                        <span className="text-sm font-semibold text-amber-600">{event.price}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-amber-900 transition-colors duration-300 group-hover:text-amber-700">
                        {event.title}
                      </h3>
                      <p className="mb-2 text-sm font-medium text-amber-600">{event.tagline}</p>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{event.description}</p>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {event.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                              {feature}
                            </span>
                          ))}
                          {event.features.length > 2 && (
                            <span className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-600">
                              +{event.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                          <Calendar className="mr-2 size-4 transition-transform duration-300 group-hover:scale-110" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                          <Clock className="mr-2 size-4 transition-transform duration-300 group-hover:scale-110" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                          <MapPin className="mr-2 size-4 transition-transform duration-300 group-hover:scale-110" />
                          <span className="line-clamp-1 text-sm">{event.location}</span>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="mr-2 size-4 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                          <span className={`text-sm font-semibold ${getAvailabilityColor(event.booked, event.capacity)} transition-colors duration-300`}>
                            {event.booked}/{event.capacity} booked
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="size-4 fill-current text-yellow-400 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                          <span className="ml-1 text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      <button className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-amber-400/25 active:scale-95 group-hover:from-amber-500 group-hover:to-yellow-600">
                        <span className="group-hover:animate-pulse">View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <div className="animate-fade-in py-12 text-center">
                  <div className="mb-4 text-6xl opacity-50">😔</div>
                  <p className="text-lg text-gray-500">No events found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedService('all');
                    }}
                    className="mt-4 rounded-lg bg-amber-500 px-6 py-2 text-white transition-colors hover:bg-amber-600"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
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

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default ScheduledEventsPage;