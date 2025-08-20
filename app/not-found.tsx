"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const GoldAnimatedBackground = () => (
  <div className="pointer-events-none absolute left-0 top-0 -z-10 size-full">
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
    </svg>
  </div>
);

const Sparkles = () => (
  <div className="pointer-events-none absolute inset-0 -z-20">
    {[...Array(18)].map((_, i) => {
      const width = 6 + Math.random() * 8;
      const height = 6 + Math.random() * 8;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      return (
        <div
          key={i}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}%`,
            top: `${top}%`,
            position: "absolute",
          }}
        >
          <motion.span
            className="absolute size-full rounded-full bg-yellow-200 opacity-60 blur-sm"
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
        </div>
      );
    })}
  </div>
);

// Floating circles for festive effect
const floatingCircles = [
  { size: "120px", top: "10%", left: "5%", delay: 0 },
  { size: "80px", top: "60%", left: "10%", delay: 0.5 },
  { size: "100px", top: "20%", left: "80%", delay: 1 },
  { size: "60px", top: "75%", left: "70%", delay: 1.5 },
  { size: "90px", top: "40%", left: "50%", delay: 0.8 },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      <GoldAnimatedBackground />
      <Sparkles />
      {floatingCircles.map((circle, i) => (
        <div
          key={i}
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
        >
          <motion.div
            initial={{ y: 0, x: 0, opacity: 0.4 }}
            animate={{ y: -20, x: 10, opacity: 0.6 }}
            transition={{
              duration: 2.5 + i,
              delay: circle.delay,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="size-full"
          />
        </div>
      ))}
      <motion.main
        className="animate-border-glow relative z-10 flex w-full max-w-lg flex-col items-center rounded-3xl border border-yellow-100 bg-white/80 p-10 text-center shadow-2xl backdrop-blur-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      >
        <Image
          src="/assets/friguslogo.png"
          alt="Frigus Fiesta Logo"
          width={120}
          height={120}
          className="mb-6"
        />
        <motion.h1
          className="mb-2 text-6xl font-extrabold text-yellow-500 drop-shadow-lg"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
        >
          404
        </motion.h1>
        <motion.h2
          className="mb-2 text-2xl font-semibold text-gray-700"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 100 }}
        >
          Page Not Found
        </motion.h2>
        <motion.p
          className="mb-6 max-w-md text-gray-500"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 100, delay: 0.1 }}
        >
          Oops! The page you are looking for doesn&apos;t exist or has been moved.<br />
          <span className="font-semibold text-yellow-600">Let&apos;s get you back to the celebration!</span>
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/"
            className="inline-block rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white shadow transition-colors"
          >
            Go to Homepage
          </Link>
        </motion.div>
        <motion.p
          className="mt-8 text-sm text-gray-400"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Still lost? Contact us at <a href="mailto:info@frigusfiesta.com" className="text-yellow-600 underline">info@frigusfiesta.com</a>
        </motion.p>
      </motion.main>
      <style jsx>{`
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 24px 4px #fde04744, 0 0 0 0 #fbbf2444; }
          50% { box-shadow: 0 0 48px 8px #fde04788, 0 0 0 0 #fbbf2488; }
        }
        .animate-border-glow {
          animation: border-glow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 