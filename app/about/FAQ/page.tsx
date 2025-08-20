"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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

const faqs = [
  {
    q: "What types of events does Frigus Fiesta organize?",
    a: "Frigus Fiesta specializes in organizing a wide range of events, including corporate gatherings, live concerts, social parties, weddings, and more.",
  },
  {
    q: "How do I book an event with Frigus Fiesta?",
    a: "Booking an event with Frigus Fiesta is easy! Simply contact our team via phone, email, or our website, and we'll guide you through the process step by step.",
  },
  {
    q: "Can I customize my event?",
    a: "Absolutely! At Frigus Fiesta, we believe in tailoring our services to suit your unique preferences and requirements. Whether you have a specific theme in mind or a special request, we'll work closely with you to bring your vision to life.",
  },
  {
    q: "Does Frigus Fiesta provide event planning services for individuals?",
    a: "Yes, we do! Whether you're celebrating a personal milestone or hosting a private gathering, our team is here to make your event truly unforgettable.",
  },
  {
    q: "What makes Frigus Fiesta stand out from other event organizers?",
    a: "What sets Frigus Fiesta apart is our unwavering commitment to excellence, creativity, and customer satisfaction. With a passion for innovation and a dedication to delivering memorable experiences, we go above and beyond to ensure that every event is a resounding success.",
  },
  {
    q: "Do you offer event design and decoration services?",
    a: "Yes, we offer event design and decoration services to create a beautiful and memorable event.",
  },
  {
    q: "Can your company provide catering services for my event?",
    a: "Yes, we can provide catering services tailored to your event's needs and budget.",
  },
  {
    q: "Do you offer event equipment rental services?",
    a: "Yes, we offer event equipment rental services including audiovisual equipment, furniture, and more.",
  },
  {
    q: "Can your company help with obtaining permits and licenses for my event?",
    a: "Yes, we can assist you with obtaining the necessary permits and licenses for your event.",
  },
  {
    q: "What sets your event company apart from others?",
    a: "Our event company stands out for our attention to detail, creativity, and dedication to creating unforgettable events for our clients.",
  },
];

const FAQPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(faqSectionRef, { once: true, amount: 0.2 });
  const handleScrollToFaq = () => {
    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskOpen = () => setShowAskModal(true);
  const handleAskClose = () => {
    setShowAskModal(false);
    setForm({ name: "", email: "", question: "" });
    setSubmitted(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      handleAskClose();
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
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
        <div className={`relative z-10 flex h-full items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="animate-text-shimmer inline-block text-white">
                FAQ's
              </span>
            </h1>
            <p className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Find answers to the most common questions about our services, process, and more.
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button
                className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300"
                onClick={handleAskOpen}
              >
                Ask a Question
              </button>
              <button
                className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300"
                onClick={handleScrollToFaq}
              >
                View All FAQs
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
      <div ref={faqSectionRef} className="mx-auto max-w-7xl px-4 py-16">
        <motion.h2
          className="mb-10 text-center text-3xl font-extrabold text-black md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked <span className='text-yellow-500'>Questions</span>
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {faqs.map((faq, index) => (
            <motion.details
              key={faq.q}
              className="group flex flex-col rounded-2xl border border-yellow-200 bg-white/95 p-7 shadow-xl transition-all duration-300 hover:shadow-amber-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <summary className="text-md flex cursor-pointer list-none items-center justify-between font-semibold text-black outline-none transition-colors duration-200 group-open:text-yellow-900 md:text-xl">
                <span className="grow">{faq.q}</span>
                <span className="ml-4 shrink-0 transition-transform duration-300 group-open:rotate-180">
                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="group-open:animate-fade-in mt-4 grow text-base text-gray-700 transition-all duration-300">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showAskModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleAskClose}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
                onClick={handleAskClose}
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="mb-4 text-2xl font-bold text-yellow-700">Ask a Question</h3>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="mb-2 text-green-500" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <p className="text-lg font-semibold text-green-600">Thank you! Your question has been submitted.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-yellow-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-gray-800 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-yellow-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-gray-800 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-yellow-700">Your Question</label>
                    <textarea
                      name="question"
                      value={form.question}
                      onChange={handleFormChange}
                      required
                      rows={4}
                      className="w-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-gray-800 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:from-yellow-500 hover:to-amber-600"
                  >
                    Submit Question
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default FAQPage; 