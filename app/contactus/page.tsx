"use client"

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Star, Sparkles, Clock, Users } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

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

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const response = await fetch('https://backend-server.frigus-fiesta.workers.dev/general/contactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }
      setIsSubmitted(true);
      setSubmitSuccess('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', description: '' });
      toast.success('Message sent!');
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmitSuccess(null);
      }, 3000);
    } catch (error: any) {
      setSubmitError(error.message || 'Something went wrong.');
      setTimeout(() => setSubmitError(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@frigusfiesta.com',
      subtext: 'Get in touch via email',
      color: 'from-amber-400 to-yellow-600',
      type: 'email',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '91-91826-84160',
      subtext: '24/7 Customer Support',
      color: 'from-purple-400 to-pink-600',
      type: 'phone',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Hyderabad, Telangana',
      subtext: '37-74/15/3A C 158, JJ NAGAR NEREDMET SAINIKPURI DEFENCE COLONY',
      color: 'from-blue-400 to-indigo-600',
      type: 'location',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7609.93065747853!2d78.55794824031105!3d17.50916843359547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9b5918496265%3A0x4d19b982b705c4df!2sJawahar%20Nagar%2C%20Sainikpuri%2C%20Secunderabad%2C%20Telangana%20500094!5e0!3m2!1sen!2sin!4v1750941309487!5m2!1sen!2sin',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon - Fri: 9AM - 6PM',
      subtext: 'Weekend: 10AM - 4PM',
      color: 'from-green-400 to-teal-600',
      type: 'hours',
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Toaster position="top-right" />
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
        <div className={`relative z-10 flex h-full items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="animate-text-shimmer inline-block text-white">
                Contact Us
              </span>
            </h1>
            <p className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              Ready to start something amazing? Let's create magic together with a touch of gold.
              We're here to make your dreams a reality.
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              <button className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-amber-400/25">
                Get In Touch
              </button>
              <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-yellow-600">
                Schedule Call
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
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">Get In <span className='text-yellow-500'>Touch</span></h2>
            <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-3xl text-xl text-gray-600">
              We are very proud of our client base and the lasting relationships we have forged over many years
            </p>
          </div>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="animate-fade-in-up group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}></div>
                <div className="relative p-8 text-center">
                  <div className={`mx-auto mb-4 size-16 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg transition-transform duration-300  group-hover:rotate-6`}>
                    <info.icon className="size-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-amber-900 transition-colors duration-300 hover:text-amber-700">
                    {info.title}
                  </h3>
                  <p className="mb-1 font-semibold text-gray-800">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-600">
                    {info.subtext}
                  </p>
                  {info.type === 'phone' && (
                    <button 
                      className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 rounded-b-2xl bg-gradient-to-r from-purple-400 to-pink-600 px-4 py-3 font-semibold text-white transition-transform duration-300 hover:shadow-lg group-hover:translate-y-0"
                      onClick={() => window.open('tel:91-91826-84160', '_blank')}
                    >
                      <Phone className="size-4" />
                      Call Now
                    </button>
                  )}
                  {info.type === 'email' && (
                    <button 
                      className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 rounded-b-2xl bg-gradient-to-r from-amber-400 to-yellow-600 px-4 py-3 font-semibold text-white transition-transform duration-300 hover:shadow-lg group-hover:translate-y-0"
                      onClick={() => window.open('mailto:info@frigusfiesta.com', '_blank')}
                    >
                      <Mail className="size-4" />
                      Send Email
                    </button>
                  )}
                  {info.type === 'location' && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <iframe
                        src={info.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: '200px', borderRadius: '1rem' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${info.title} Location`}
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="animate-fade-in-up mb-6 text-4xl font-bold text-black md:text-5xl">Send us a <span className='text-yellow-500'>description</span></h2>
            <p className="animate-fade-in-up animation-delay-200 text-xl text-gray-600">We'd love to hear from you and discuss your next project</p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="animate-slide-in-up rounded-2xl bg-white p-8 shadow-lg transition-all duration-500">
                <div className="absolute -right-4 -top-4 size-8 animate-ping rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-20" />
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
                  <Send className="size-6 text-yellow-500 transition-transform duration-300 hover:rotate-12" />
                  Get Started Today
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="group relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange} 
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="group relative overflow-hidden">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                        placeholder="Your Email"
                        required
                      />
                      <button 
                        className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 rounded-b-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 font-semibold text-white transition-transform duration-300 hover:shadow-lg group-hover:translate-y-0"
                        onClick={() => window.open('mailto:info@frigusfiesta.com', '_blank')}
                      >
                        <Send className="size-4" />
                        Send Email
                      </button>
                    </div>
                  </div>
                  <div className="group relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                      placeholder="Subject"
                      required
                    />
                  </div>
                  <div className="group relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-amber-300 hover:shadow-lg focus:outline-none"
                      placeholder="Tell us about your golden ideas..."
                      required
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted || isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-4 font-semibold text-white  shadow-lg transition-all duration-300 hover:shadow-amber-400/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Star className="size-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Star className="size-5 animate-spin" />
                        description Sent! ✨
                      </>
                    ) : (
                      <>
                        <Send className="size-5 transition-transform duration-300 hover:rotate-12" />
                        <span className="hover:animate-pulse">Send Golden description</span>
                      </>
                    )}
                  </button>
                  {submitSuccess && (
                    <div className="mt-4 text-center font-semibold text-green-600">{submitSuccess}</div>
                  )}
                  {submitError && (
                    <div className="mt-4 text-center font-semibold text-red-600">{submitError}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="animate-slide-in-up animation-delay-200 relative overflow-hidden rounded-2xl bg-white  p-8 text-white shadow-xl transition-all duration-500">
                <div className="absolute right-0 top-0 size-32 -translate-y-16 translate-x-16 rounded-full bg-white/10" />
                <div className="absolute bottom-0 left-0 size-24 -translate-x-12 translate-y-12 rounded-full bg-white/10" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    <Sparkles className="size-8 animate-pulse text-yellow-500" />
                    <h3 className="text-2xl font-bold text-yellow-500">
                      Why Choose Us?
                    </h3>
                  </div>
                  <p className="mb-6 leading-relaxed text-gray-400">
                    Ready to turn your dreams into golden reality? We're here to make it happen with style, innovation, and unmatched dedication to excellence.
                  </p>
                  <div className="space-y-3">
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
                      <span className="text-gray-400">Expert Team</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-slide-in-up animation-delay-400 rounded-2xl bg-white p-6  shadow-xl transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <Users className="size-6 text-yellow-500" />
                  <h4 className="text-xl font-bold text-yellow-500">Join Our Community</h4>
                </div>
                <p className="mb-4 text-gray-600">
                  Connect with thousands of satisfied clients who trust us with their most important events and projects.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-current text-yellow-400" />
                    <span className="font-semibold text-amber-900">4.9/5</span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">2,500+ Happy Clients</span>
                </div>
              </div>
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