"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaFeatherAlt } from "react-icons/fa";

import Header from "@/components/Header";
import Footer from "@/components/Footer-dark-theme";

// GoldAnimatedBackground and floatingCircles copied from HomeServices/HomeAbout/Testimonials
const floatingCircles = [
  { size: "120px", top: "10%", left: "5%", delay: 0 },
  { size: "80px", top: "60%", left: "10%", delay: 0.5 },
  { size: "100px", top: "20%", left: "80%", delay: 1 },
  { size: "60px", top: "75%", left: "70%", delay: 1.5 },
  { size: "90px", top: "40%", left: "50%", delay: 0.8 },
];

const GoldAnimatedBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full">
    <svg
      className="absolute size-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
    >
      <path
        d="M -100 500 C 400 1000, 800 100, 1100 450 S 1600 1000, 2020 600"
        stroke="#FFD700"
        strokeWidth="2.5"
        fill="none"
        opacity="0.18"
      />
      <path
        d="M 0 200 C 300 400, 600 100, 900 300 S 1200 500, 1500 200"
        stroke="#FFB300"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
      />
      <path
        d="M 200 800 C 500 600, 800 900, 1100 700 S 1400 500, 1700 800"
        stroke="#FFD700"
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

const terms = [
  {
    title: "1. Pricing & Currency",
    text: "All event services start from INR 15,000. Prices listed are in Indian Rupees (INR) for Indian clients and US Dollars (USD) for international clients. Applicable taxes (GST or others) are charged separately as per prevailing government rates.",
  },
  {
    title: "2. Service Availability",
    text: "We strive to ensure that all services listed are available and accurately priced. However, Frigus Fiesta reserves the right to modify or discontinue any service without prior notice.",
  },
  {
    title: "3. Booking & Payment",
    text: "A confirmed booking requires advance payment as communicated during booking. Accepted payment methods include: Credit/Debit Card, UPI, Net Banking, IMPS, NEFT, RTGS, and Cheque (India only). Overseas clients can pay via international cards or wire transfers.",
  },
  {
    title: "4. Cancellation & Refund Policy",
    text: "Refunds, if applicable, will be processed within 15–20 working days from the cancellation request. Refunds depend on confirmation from our vendors or service partners. Credit card payments will be refunded back to the card. Other payments will be refunded via NEFT/RTGS/IMPS or cheque within 30 days. All refunds are subject to approval and processing timelines from third-party vendors. Frigus Fiesta acts only as a facilitator and is not liable for delays or failures in refunds beyond our control.",
  },
  {
    title: "5. Liability Disclaimer",
    text: "Frigus Fiesta shall not be held responsible for any delays, service deficiencies, vendor-related issues, pricing changes, or other unforeseen circumstances. We do not accept liability for any personal loss, damage, accident, or disruption during or due to the service booked.",
  },
  {
    title: "6. Intellectual Property",
    text: "All content on our website, including logos, event designs, images, and text, are the intellectual property of Frigus Fiesta. Unauthorized use is prohibited.",
  },
  {
    title: "7. Jurisdiction",
    text: "These Terms are governed by the laws of India. Any disputes arising will be handled in the courts of Hyderabad, Telangana.",
  },
];

// Sparkle/particle effect
const Sparkles = () => (
  <div className="pointer-events-none absolute inset-0 -z-20">
    {[...Array(18)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full bg-yellow-200 opacity-60 blur-sm"
        style={{
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -10 - Math.random() * 20, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "mirror",
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const TermsAndConditionsPage = () => {
  return (
    <>
      <Header />
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-24">
        <GoldAnimatedBackground />
        <Sparkles />
        {/* Floating/rotating feather icon */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-24 z-0 text-yellow-300 opacity-30"
          style={{ fontSize: 120, marginLeft: -60 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <FaFeatherAlt />
        </motion.div>
        {floatingCircles.map((circle, _i) => (
          <motion.div
            key={_i}
            className="pointer-events-none absolute z-0 opacity-40 blur-2xl"
            style={{
              width: circle.size,
              height: circle.size,
              top: circle.top,
              left: circle.left,
              background:
                "radial-gradient(circle at 60% 40%, #fde047 60%, #fbbf24 100%)",
              borderRadius: "50%",
            }}
            initial={{ y: 0, x: 0, opacity: 0.4 }}
            animate={{ y: -20, x: 10, opacity: 0.6 }}
            transition={{
              duration: 2.5 + _i,
              delay: circle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="animate-border-glow relative z-10 flex w-full max-w-3xl flex-col items-center rounded-3xl border border-yellow-100 bg-white/80 p-10 shadow-2xl backdrop-blur-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
        >
          <motion.h1
            className="mb-4 text-center text-3xl font-extrabold text-gray-900 md:text-4xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
          >
            Terms <span className="text-yellow-400">&amp; Conditions</span>
          </motion.h1>
          <motion.p
            className="mb-8 text-center text-base font-medium text-gray-700"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 100 }}
          >
            Please read these Terms and Conditions carefully before using our
            website.
          </motion.p>
          <motion.div
            className="flex w-full flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {terms.map((term, _i) => (
              <motion.div
                key={term.title}
                className="mb-2"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.35,
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
              >
                <motion.h2
                  className="mb-2 text-xl font-bold text-yellow-600"
                  initial={false}
                  animate={false}
                >
                  {term.title}
                </motion.h2>
                <motion.p
                  className="text-base text-gray-700"
                  initial={false}
                  animate={false}
                >
                  {term.text}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-10 w-full text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Frigus Fiesta. All rights
            reserved.
          </div>
        </motion.div>
        {/* Border glow animation */}
        <style jsx>{`
          .animate-border-glow {
            box-shadow:
              0 0 32px 0 #fde04766,
              0 0 0 4px #fde04722;
            animation: borderGlow 3s ease-in-out infinite alternate;
          }
          @keyframes borderGlow {
            0% {
              box-shadow:
                0 0 32px 0 #fde04766,
                0 0 0 4px #fde04722;
            }
            100% {
              box-shadow:
                0 0 48px 8px #fde047bb,
                0 0 0 8px #fde04744;
            }
          }
        `}</style>
      </section>
      <Footer />
    </>
  );
};

export default TermsAndConditionsPage;
