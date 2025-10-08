"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, Star, Sparkles, Coffee, Gift } from 'lucide-react';

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

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    try {
      // Prepare the data according to the API specification
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        services: [formData.service], // Convert single service to array
        description: formData.message
      };

      const response = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Success - reset form and show success message
        setFormData({ name: '', email: '', phone: '', service: '', date: '', time: '', message: '' });
        setCurrentStep(1);
        console.log('Appointment booked successfully!');
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error('Failed to book appointment:', errorData);
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking your appointment. Please try again.');
    } finally {
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const services = [
    { id: 'event-planning', name: 'Event Planning', icon: Gift, price: 'From ₹15,000' },
    { id: 'wedding', name: 'Wedding Services', icon: Star, price: 'From ₹50,000' },
    { id: 'corporate', name: 'Corporate Events', icon: Coffee, price: 'From ₹25,000' },
    { id: 'consultation', name: 'Consultation', icon: User, price: 'From ₹2,000' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

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
                Book Your Appointment
              </span>
            </h1>
            <p className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Ready to create something extraordinary? Schedule your golden consultation today 
              and let's bring your vision to life with our premium services.
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <button 
                onClick={() => {
                  const el = document.getElementById('booking-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-amber-400/25"
              >
                Book Now
              </button>
              <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-yellow-600">
                View Services
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
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">
              Our <span className='text-yellow-500'>Services</span>
            </h2>
            <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-3xl text-xl text-gray-600">
              Choose from our premium range of services designed to make your special moments unforgettable
            </p>
          </div>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-fade-in-up group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all  duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-600 opacity-10 transition-opacity duration-300 group-hover:opacity-20"></div>
                <div className="relative p-8 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg transition-transform duration-300 group-hover:rotate-6">
                    <service.icon className="size-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-amber-900 transition-colors duration-300 hover:text-amber-700">
                    {service.name}
                  </h3>
                  <p className="mb-1 font-semibold text-gray-800">
                    {service.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Premium quality service
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Booking Form */}
      <div id="booking-form" className="bg-gradient-to-br from-amber-50 to-yellow-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">
              Book Your <span className='text-yellow-500'>Appointment</span>
            </h2>
            <p className="animate-fade-in-up animation-delay-200 text-xl text-gray-600">
              Let's schedule your golden moment - just a few simple steps
            </p>
          </div>
          {/* Progress Steps */}
          <div className="mb-12 flex justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex size-10 items-center justify-center rounded-full font-bold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`mx-2 h-1 w-16 transition-all duration-300 ${
                      currentStep > step ? 'bg-yellow-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="animate-slide-in-up rounded-2xl bg-white p-8 shadow-lg transition-all duration-500">
            <div>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
                    <User className="size-6 text-yellow-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="group relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        placeholder="Your Full Name"
                        required
                      />
                    </div>
                    <div className="group relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="group relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                      placeholder="Your Phone Number"
                      required
                    />
                  </div>
                </div>
              )}
              {/* Step 2: Service & Date Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
                    <Calendar className="size-6 text-yellow-500" />
                    Service & Schedule
                  </h3>
                  <div className="group relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                      required
                    >
                      <option value="">Select a Service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="group relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="group relative">
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        required
                      >
                        <option value="">Select Time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
                    <Sparkles className="size-6 text-yellow-500" />
                    Additional Details
                  </h3>
                  <div className="group relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                      placeholder="Tell us more about your requirements, special requests, or any questions you have..."
                    />
                  </div>
                  {/* Booking Summary */}
                  <div className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-6">
                    <h4 className="mb-4 font-bold text-amber-900">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{formData.name || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold">
                          {services.find(s => s.id === formData.service)?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{formData.date || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{formData.time || 'Not selected'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
                    currentStep === 1 
                      ? 'cursor-not-allowed bg-gray-200 text-gray-400' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-amber-400/25 active:scale-95"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3 font-semibold text-white shadow-lg  transition-all duration-300 hover:shadow-amber-400/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="size-5 animate-spin" />
                        Appointment Booked! ✨
                      </>
                    ) : (
                      <>
                        <Calendar className="size-5 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="hover:animate-pulse">Book Appointment</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Why Choose Us Section */}
      <div className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="animate-slide-in-up relative overflow-hidden rounded-2xl border border-yellow-300  bg-gray-50 p-8 text-white shadow-xl transition-all duration-500">
            <div className="absolute right-0 top-0 size-32 -translate-y-16 translate-x-16 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 size-24 -translate-x-12 translate-y-12 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <Star className="size-8 animate-pulse text-yellow-500" />
                <h3 className="text-2xl font-bold text-yellow-500">Premium Experience</h3>
              </div>
              <p className="mb-6 leading-relaxed text-gray-400">
                Experience the golden standard of service with our expert team, premium facilities, and personalized approach to every appointment.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">Expert Consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 animate-pulse rounded-full bg-yellow-300" />
                  <span className="text-gray-400">Premium Quality Service</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="animate-slide-in-up animation-delay-200 rounded-2xl border-2 border-yellow-200 bg-white  p-8 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="size-6 text-yellow-500" />
                <h4 className="text-xl font-bold text-amber-900">Quick & Easy Booking</h4>
              </div>
              <p className="text-gray-600">
                Book your appointment in just 3 simple steps. Our streamlined process makes scheduling effortless and convenient.
              </p>
            </div>
            <div className="animate-slide-in-up animation-delay-400 rounded-2xl border-2 border-yellow-200 bg-white  p-8 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="size-6 text-yellow-500" />
                <h4 className="text-xl font-bold text-amber-900">Convenient Location</h4>
              </div>
              <p className="mb-3 text-gray-600">
                Located in the heart of Hyderabad, easily accessible with ample parking and premium facilities.
              </p>
              <p className="text-sm text-gray-500">37-74/15/3A C 158, JJ NAGAR NEREDMET SAINIKPURI DEFENCE COLONY, MALKAJGIRI 500094</p>
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
      <Footer />
    </div>
  );
}
