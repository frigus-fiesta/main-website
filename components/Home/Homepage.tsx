"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Homepage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden text-white">
      <div 
        className="absolute z-0 size-full"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster='/Hero-video-poster.jpg'
          className="size-full scale-110 object-cover"
        >
          <source src="/assets/homepagevideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div 
        className="absolute inset-0 z-10 bg-black/60"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      <motion.div 
        className="relative z-20 flex flex-col items-center px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          transform: `translateY(${scrollY * -0.2}px)`,
        }}
      >
        <motion.p 
          className="md:text-md mb-4 text-sm uppercase md:tracking-wide"
          variants={itemVariants}
          style={{
            transform: `translateY(${scrollY * -0.1}px)`,
          }}
        >
          Unforgettable Moments, Effortlessly Delivered.
        </motion.p>
        <motion.h1 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-6xl font-extrabold uppercase leading-none tracking-tighter text-transparent md:text-8xl"
          variants={itemVariants}
          style={{ 
            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            transform: `translateY(${scrollY * -0.15}px)`,
          }}
        >
          Book Now
        </motion.h1>
        <motion.h2 
          className="mt-2 text-5xl font-bold tracking-wide"
          variants={itemVariants}
          style={{
            transform: `translateY(${scrollY * -0.25}px)`,
          }}
        >
          Learn More
        </motion.h2>
        <motion.div 
          className="mt-12" 
          variants={itemVariants}
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        >
          <Link href="/appointment">
            <span className="cursor-pointer rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-4 font-bold uppercase text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Curate Event With Us
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Homepage;