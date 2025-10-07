/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
"use client"
import React, { useState, useEffect, useRef } from 'react';
// import { NavbarDemo } from '@/components/Navbar';
import Image from 'next/image';
import { Users, Star, Calendar, MessageSquare, Edit, Trash2, Eye, MapPin, User, Clock, CheckCircle, X, Mail, Phone, Globe } from 'lucide-react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import EventModal from '@/components/admin-dashboard/event-modal';

interface Profile {
  id: number;
  uuid: string;
  created_at: string;
  full_name: string;
  avatar_url: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  updated_at: string;
  email_notifications: string | null;
  bio: string | null;
  user_login_info: any;
  email: string;
  reviews: any;
}

interface Review {
  id: number;
  review_of: string;
  uuid: string;
  comment: string;
  rate: number;
  like_count: number;
  commented_on: string;
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  tagline: string;
  eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  hostedBy: string;
  venue: string;
  imageGallery: string;
  eventPrice: string | number;
  ticketPricingList: string;
  importantInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface EventPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventPageModal = ({ isOpen, onClose, event }: EventPageModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

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

  const parseHostedBy = (hostedByString: string) => {
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

  if (!isOpen || !event) return null;

  const hostedBy = parseHostedBy(event.hostedBy);
  const ticketPricing = parseTicketPricing(event.ticketPricingList);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white">
        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Event Preview: {event.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
          </div>
          {/* Event Content */}
          <div className="px-6 pb-6">
            {/* Hero Section */}
            <div className="relative mb-8 h-64 overflow-hidden rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
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
              <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
                <div className="max-w-4xl">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold capitalize text-white backdrop-blur-sm">
                      {event.category} Event
                    </span>
                  </div>
                  <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {event.title}
                  </h1>
                  <p className="text-lg text-amber-100">
                    {event.tagline}
                  </p>
                </div>
              </div>
            </div>
            {/* Event Details */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">About This Event</h2>
                  <p className="leading-relaxed text-gray-700">{event.description}</p>
                </div>
                {event.importantInfo && (
                  <div className="mb-8 rounded-lg bg-yellow-50 p-6">
                    <h3 className="mb-3 text-lg font-semibold text-yellow-800">Important Information</h3>
                    <p className="text-yellow-700">{event.importantInfo}</p>
                  </div>
                )}
                {ticketPricing.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">Ticket Pricing</h3>
                    <div className="space-y-3">
                      {ticketPricing.map((ticket: any, index: number) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticket.type}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-600">
                              ${ticket.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Details Card */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 size-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900">Date & Time</p>
                        <p className="text-sm text-gray-600">{formatDate(event.eventDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900">Venue</p>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="mt-1 size-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900">Category</p>
                        <p className="text-sm capitalize text-gray-600">{event.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 size-5 text-yellow-500">💰</div>
                      <div>
                        <p className="font-medium text-gray-900">Price</p>
                        <p className="text-sm text-gray-600">
                          {typeof event.eventPrice === 'number' && event.eventPrice > 0 
                            ? `$${event.eventPrice}` 
                            : 'Free'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Organizer Card */}
                {hostedBy && (
                  <div className="rounded-lg border border-gray-200 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Organizer</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-900">{hostedBy.name}</p>
                      </div>
                      {hostedBy.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{hostedBy.email}</p>
                        </div>
                      )}
                      {hostedBy.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{hostedBy.phone}</p>
                        </div>
                      )}
                      {hostedBy.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="size-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{hostedBy.website}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MailModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSubject('');
      setEmail('');
      setMessage('');
      if (formRef.current) formRef.current.reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the values
    console.log({ name, subject, email, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-yellow-200 bg-white shadow-2xl">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-yellow-700">
              <Mail className="size-6 text-black" /> Send Mail
            </h3>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-yellow-600">
              <X className="size-7" />
            </button>
          </div>
          <form ref={formRef} onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Subject *</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Message *</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="min-h-[100px] w-full rounded-lg border border-gray-300 px-4 py-2 transition-all focus:outline-none" required />
            </div>
            <button type="submit" className="w-full rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white shadow transition-all hover:bg-yellow-600 focus:outline-none">
              Send Mail
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'reviews' | 'events' | 'appointments'>('profiles');
  
  // Data states
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventPageModalOpen, setIsEventPageModalOpen] = useState(false);
  const [selectedEventForPage, setSelectedEventForPage] = useState<Event | null>(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);

  const correctPassword = '2025';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load profiles
      const profilesResponse = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/get-all-profiles');
      const profilesData:any = await profilesResponse.json();
      if (profilesData.success) {
        setProfiles(profilesData.data);
      }

      // Load reviews
      const reviewsResponse = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/get-all-reviews');
      const reviewsData:any = await reviewsResponse.json();
      if (reviewsData.success) {
        setReviews(reviewsData.data);
      }

      // Load appointments
      const appointmentsResponse = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/get-all-appointments');
      const appointmentsData:any = await appointmentsResponse.json();
      if (appointmentsData.success) {
        setAppointments(appointmentsData.data);
      }

      // Load events
      const allEventsResponse = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/get-all-events');
      const eventsData:any = await allEventsResponse.json();
      if (eventsData.success) {
        setEvents(eventsData.data);
      }

      // Mock events data (replace with actual API call)
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (updatedEvent: Event) => {
    setLoading(true);
    try {
      let response;
      
      if (selectedEvent) {
        // Update existing event
        response = await fetch(`https://backend-server.frigus-fiesta.workers.dev/admin/events/update/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        });
      } else {
        // Create new event
        response = await fetch('https://backend-server.frigus-fiesta.workers.dev/admin/create-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        });
      }

      const result:any = await response.json();
      
      if (result.success) {
        // Reload events data to get the updated list
        await loadData();
        setIsEventModalOpen(false);
        setSelectedEvent(null);
      } else {
        console.error('Error saving event:', result.message);
        alert('Error saving event: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      try {
        const response = await fetch(`https://backend-server.frigus-fiesta.workers.dev/admin/events/delete/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result:any = await response.json();
        
        if (result.success) {
          // Reload events data to get the updated list
          await loadData();
        } else {
          console.error('Error deleting event:', result.message);
          alert('Error deleting event: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewEventPage = (event: Event) => {
    setSelectedEventForPage(event);
    setIsEventPageModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 focus:outline-none"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="size-16 animate-spin rounded-full border-t-4 border-solid border-yellow-600"></div>
          <p className="mt-4 text-lg text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Admin Dashboard</h1>
            <p className="md:text-md mt-2 text-sm text-gray-600">Manage your website data and content</p>
          </div>
          <button
            onClick={() => setIsMailModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
          >
            <Mail className="size-4" />
            Mail
          </button>
        </div>
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 -mx-4 flex space-x-8 overflow-x-auto overflow-y-hidden px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`${
                activeTab === 'profiles'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Users className="size-4" />
              Profiles ({profiles.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Star className="size-4" />
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <Calendar className="size-4" />
              Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`${
                activeTab === 'appointments'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <MessageSquare className="size-4" />
              Appointments ({appointments.length})
            </button>
          </nav>
        </div>
        {/* Content */}
        <div className="rounded-lg bg-white shadow">
          {activeTab === 'profiles' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="size-10 shrink-0">
                            <Image
                              src={profile.avatar_url && profile.avatar_url.trim() !== '' ? profile.avatar_url : '/assets/default.jpg'}
                              alt={profile.full_name}
                              width={40}
                              height={40}
                              className="size-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{profile.full_name}</div>
                            <div className="text-sm text-gray-500">ID: {profile.uuid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{profile.email}</div>
                        {profile.phone && (
                          <div className="text-sm text-gray-500">{profile.phone}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {profile.city && profile.state ? (
                          <div className="text-sm text-gray-900">
                            {profile.city}, {profile.state}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Not specified</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button className="flex items-center gap-1 text-yellow-600 hover:text-yellow-900">
                          <Eye className="size-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{review.review_of}</div>
                        <div className="text-sm text-gray-500">User: {review.uuid}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">({review.rate}/5)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">{review.comment}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(review.commented_on).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button className="flex items-center gap-1 text-red-600 hover:text-red-900">
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'events' && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Events Management</h3>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setIsEventModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                  <Calendar className="size-4" />
                  Add New Event
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event Page</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">{event.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="mb-1 flex items-center gap-2">
                              <Calendar className="size-4 text-gray-400" />
                              {new Date(event.eventDate).toLocaleDateString()}
                            </div>
                            <div className="mb-1 flex items-center gap-2">
                              <MapPin className="size-4 text-gray-400" />
                              {event.venue}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="size-4 text-gray-400" />
                              {event.hostedBy ? JSON.parse(event.hostedBy).name : 'Unknown'}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(event.eventStatus)}`}>
                            {event.eventStatus.charAt(0).toUpperCase() + event.eventStatus.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleViewEventPage(event)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-900"
                          >
                            <Eye className="size-4" />
                            View Page
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="flex items-center gap-1 text-yellow-600 hover:text-yellow-900"
                            >
                              <Edit className="size-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'appointments' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                        <div className="text-sm text-gray-500">{appointment.email}</div>
                        {appointment.phone && (
                          <div className="text-sm text-gray-500">{appointment.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {JSON.parse(appointment.services).map((service: string, index: number) => (
                            <span key={index} className="mb-1 mr-1 inline-block rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="mb-1 flex items-center gap-2">
                            <Calendar className="size-4 text-gray-400" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-400" />
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-green-600 hover:text-green-900">
                            <CheckCircle className="size-4" />
                            Confirm
                          </button>
                          <button className="flex items-center gap-1 text-red-600 hover:text-red-900">
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        isLoading={loading}
      />
      <EventPageModal
        isOpen={isEventPageModalOpen}
        onClose={() => setIsEventPageModalOpen(false)}
        event={selectedEventForPage}
      />
      <MailModal
        isOpen={isMailModalOpen}
        onClose={() => setIsMailModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;