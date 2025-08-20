"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import Footer from "@/components/Footer-dark-theme";
import Header from "@/components/Header";

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

const teamMembers = [
  {
    name: "Naveen Cheery",
    image: "/assets/default.jpg",
    role: "Founder & CEO",
    description:
      "Naveen is the visionary founder and CEO, leading the team with passion and innovation.",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/naveencheery" },
      { platform: "Instagram", url: "https://instagram.com/naveencheery" },
      { platform: "Facebook", url: "https://facebook.com/naveencheery" },
      { platform: "X", url: "#" },
    ],
  },
  {
    name: "Sai Bhardwaj",
    image: "/assets/default.jpg",
    role: "Chief Technology Officer",
    description:
      "Sai is the CTO, driving technological excellence and overseeing all development projects.",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/saibhardwaj" },
      { platform: "Instagram", url: "https://instagram.com/saibhardwaj" },
      { platform: "Facebook", url: "https://facebook.com/saibhardwaj" },
      { platform: "X", url: "#" },
    ],
  },
  {
    name: "Manisha",
    image: "/assets/default.jpg",
    role: "Head of Operations",
    description:
      "Manisha ensures operations and coordinates the team's efforts for maximum impact.",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/manisha" },
      { platform: "Instagram", url: "https://instagram.com/manisha" },
      { platform: "Facebook", url: "https://facebook.com/manisha" },
      { platform: "X", url: "#" },
    ],
  },
];

const LinkedInIcon = () => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.53 3H21.5L13.62 10.99L22.93 21H16.28L10.97 15.13L4.97 21H1L9.32 12.56L0.27 3H7.09L11.88 8.36L17.53 3ZM16.34 19.13H18.23L6.7 4.76H4.68L16.34 19.13Z" fill="currentColor"/>
  </svg>
);

type TeamCardProps = {
  member: {
    name: string;
    image: string;
    role: string;
    description: string;
    socials: { url: string; platform: string }[];
  };
  index: number;
};

const TeamCard: React.FC<TeamCardProps> = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return <LinkedInIcon />;
      case 'Instagram':
        return <InstagramIcon />;
      case 'Facebook':
        return <FacebookIcon />;
      case 'X':
        return <XIcon />;
      default:
        return null;
    }
  };

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return 'hover:bg-[#0077B5]';
      case 'Instagram':
        return 'hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#515bd4]';
      case 'Facebook':
        return 'hover:bg-[#1877F3]';
      case 'X':
        return 'hover:bg-black';
      default:
        return 'hover:bg-yellow-500';
    }
  };

  return (
    <div
      className={`group relative transition-all duration-700 ease-out${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-yellow-300/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="relative h-80 overflow-hidden">
          <Image
            width={100000}
            height={100000}
            src={member.image}
            alt={member.name}
            className="size-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          {isHovered && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 opacity-70"
                  style={{
                    width: `${4 + Math.random() * 4}px`,
                    height: `${4 + Math.random() * 4}px`,
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                    animation: `sparkle ${1 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </>
          )}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-4">
              {member.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className={`flex size-14 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm transition-all duration-300 hover:rotate-6 ${getSocialColor(social.platform)} shadow-lg hover:text-white`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="mb-4">
            <h3 className="mb-2 text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-amber-600">
              {member.name}
            </h3>
            <div className="inline-block rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white shadow-md">
              {member.role}
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-600">
            {member.description}
          </p>
        </div>
        <div className="absolute right-4 top-4 size-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>
    </div>
  );
};

export default function AboutTeamPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setTeamVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
                Our Team
              </span>
            </h1>
            <p
              className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Meet the passionate professionals behind our success, dedicated to
              excellence and innovation in every project.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <div className="relative min-h-screen py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className={`mb-16 text-center transition-all duration-1000 ease-out ${
            teamVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
              The <span className="text-yellow-500">Team</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              United by passion, driven by excellence, and committed to delivering extraordinary results.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
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
      `}</style>
    </div>
  );
}