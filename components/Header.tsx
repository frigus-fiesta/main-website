/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

import { supabase } from '@/utils/supabase';

import SignIn from './auth/Sign-in';
import MyAccountModal from './auth/My-account-modal';

// Interface for user profile
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/',
    label: 'Who We Are',
    dropdown: [
      { href: '/about/story', label: 'About us' },
      { href: '/about/FAQ', label: 'FAQ`s' },
      // { href: '/about/team', label: 'Our Team' },
      { href: '/about/careers', label: 'Career with us' },
    ]
  },
  {
    href: '/events',
    label: 'Events',
    dropdown: [
      { href: '/corporate', label: 'Corporate Events' },
      { href: '/live', label: 'Live Events' },
      { href: '/social', label: 'Social Events' },
    ]
  },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contactus', label: 'Contact Us' },
  { href: '/appointment', label: "Book Appointment" },
];

const goldHoverColor = 'hover:text-yellow-400';
const solidNavTextColor = 'text-white';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const BACKEND_PROFILE_URL = 'https://backend-server.frigus-fiesta.workers.dev/general/get-user-profile-from-uuid/';

  // Check if user is already logged in
  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchUserProfileFromBackend(session.user.id, session.user);
    }
  };
  // Initialize auth state and check user session
  useEffect(() => {
    checkUserSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          fetchUserProfileFromBackend(session.user.id, session.user);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from backend API
  const fetchUserProfileFromBackend = async (uuid: string, fallbackUser?: any) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch(`${BACKEND_PROFILE_URL}${uuid}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result:any = await res.json();
      if (result.success && result.data) {
        setUser({
          id: result.data.uuid,
          email: result.data.email,
          full_name: result.data.full_name,
          avatar_url: result.data.avatar_url,
        });
      } else {
        // Fallback to session user if backend returns no profile
        if (fallbackUser) {
          setUser({
            id: fallbackUser.id,
            email: fallbackUser.email || '',
            full_name: fallbackUser.user_metadata?.full_name || fallbackUser.user_metadata?.name || '',
            avatar_url: fallbackUser.user_metadata?.avatar_url || '',
          });
        } else {
          setUser(null);
        }
        setProfileError(result.message || 'Profile not found.');
      }
    } catch (err: any) {
      setProfileError('Failed to fetch profile. Please check your connection.');
      setUser(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    if (isHomepage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setHasScrolled(true);
    }
  }, [pathname, isHomepage]);

  const isTransparent = isHomepage && !hasScrolled;
  const navTextColor = solidNavTextColor;

  const getGlassBackground = () => {
    if (isTransparent) {
      return 'bg-white/10 backdrop-blur-md';
    } else {
      return 'bg-black/20 backdrop-blur-lg';
    }
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  }

  const toggleSignIn = () => {
    setIsSignInOpen(!isSignInOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleOpenMyAccount = () => {
    setIsUserMenuOpen(false);
    setIsMyAccountOpen(true);
  };

  const handleCloseMyAccount = () => {
    setIsMyAccountOpen(false);
  };

  return (
    <div>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${getGlassBackground()} rounded-b-3xl shadow-lg`}>
        <div className="container mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="shrink-0">
              <Image src="/assets/friguslogo.svg" alt='logo' width={100000} height={100000} className='mt-2 size-44 md:mt-1 lg:size-52' />
            </Link>
            <div className="hidden items-center space-x-6 xl:flex">
              <nav className="flex space-x-8">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.dropdown && setHoveredItem(link.label)}
                    onMouseLeave={() => link.dropdown && setHoveredItem(null)}
                  >
                    <Link
                      href={link.href}
                      className={`group relative flex items-center text-sm font-bold transition-colors duration-300 ${navTextColor} ${goldHoverColor} drop-shadow-sm`}
                    >
                      {link.label}
                      {link.dropdown && <FaChevronDown className="ml-1.5 size-3 opacity-70" />}
                    </Link>
                    <AnimatePresence>
                      {link.dropdown && hoveredItem === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-white/20 bg-white/95 p-2 uppercase shadow-xl ring-1 ring-white/20 backdrop-blur-md"
                        >
                          {link.dropdown.map(subLink => (
                            <Link
                              key={subLink.label}
                              href={subLink.href}
                              className={`block rounded-lg px-3 py-2 text-sm text-gray-800 transition-all duration-200 hover:bg-white/50 hover:text-yellow-500`}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
              <div className="flex items-center space-x-4">
                {/* User Profile/Sign In Button */}
                {user ? (
                  <div className="relative">
                    <motion.button 
                      type='button'
                      onClick={toggleUserMenu}
                      className="relative flex items-center"
                      aria-label="User menu"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user.avatar_url ? (
                        <div className="relative size-8 overflow-hidden rounded-full border-2 border-yellow-200 transition-all hover:border-yellow-400">
                          <Image 
                            src={user.avatar_url} 
                            alt="User profile" 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 transition-colors hover:bg-yellow-200">
                          <User className="size-5" />
                        </div>
                      )}
                    </motion.button>
                    {/* User dropdown menu */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/20 bg-white/95 py-2 shadow-xl ring-1 ring-white/20 backdrop-blur-md"
                        >
                          <div className="border-b border-gray-100 px-4 py-2">
                            <p className="truncate font-medium text-gray-900">{user.full_name || 'User'}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                          </div>
                          <button 
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-yellow-50"
                            onClick={handleOpenMyAccount}
                          >
                            My Account
                          </button>
                          <motion.button 
                            type='button'
                            onClick={handleSignOut}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                            whileHover={{ x: 2 }}
                          >
                            <LogOut className="mr-2 size-4" />
                            Sign out
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button 
                    type='button'
                    onClick={toggleSignIn}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
                  >
                    Sign in
                  </motion.button>
                )}
                <Link href="/pay" className={`rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}>
                  Pay Now
                </Link>
              </div>
            </div>
            <div className="flex items-center xl:hidden">
              {/* Mobile User Profile/Sign In Button */}
              {user ? (
                <div className="relative mr-4">
                  <motion.button 
                    type='button'
                    onClick={toggleUserMenu}
                    className="relative text-white"
                    aria-label="User menu"
                  >
                    {user.avatar_url ? (
                      <div className="relative size-7 overflow-hidden rounded-full border-2 border-yellow-200">
                        <Image 
                          src={user.avatar_url} 
                          alt="User profile" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <User className="size-5 text-white hover:text-yellow-400" />
                    )}
                  </motion.button>
                  {/* Mobile User dropdown menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/20 bg-white/95 py-2 shadow-xl ring-1 ring-white/20 backdrop-blur-md"
                      >
                        <div className="border-b border-gray-100 px-4 py-2">
                          <p className="truncate font-medium text-gray-900">{user.full_name || 'User'}</p>
                          <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button 
                          type="button"
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
                          onClick={handleOpenMyAccount}
                        >
                          My Account
                        </button>
                        <motion.button 
                          type='button'
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                          whileHover={{ x: 2 }}
                        >
                          <LogOut className="mr-2 size-4" />
                          Sign out
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button 
                  type='button'
                  onClick={toggleSignIn}
                  className="mr-4 rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
                >
                  Sign in
                </motion.button>
              )}
              <button onClick={() => setIsOpen(!isOpen)} className={`focus:outline-none ${navTextColor} drop-shadow-sm`}>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* MyAccountModal integration - render at root for proper overlay */}
      {isMyAccountOpen && user && (
        <MyAccountModal 
          isOpen={isMyAccountOpen} 
          onClose={handleCloseMyAccount} 
          userUuid={user.id} 
        />
      )}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-xl xl:hidden"
            >
              <div className="flex h-full flex-col p-5">
                <div className="flex justify-end">
                  <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="mt-8 grow">
                  {navLinks.map((link) => (
                    <div key={link.label} className="border-b border-gray-100 py-2">
                      {link.dropdown ? (
                        <div>
                          <button onClick={() => toggleMobileDropdown(link.label)} className={`flex w-full items-center justify-between px-4 py-2 text-gray-700 ${goldHoverColor}`}>
                            <span>{link.label}</span>
                            <FaChevronDown className={`size-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openDropdown === link.label && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-8"
                              >
                                {link.dropdown.map(subLink => (
                                  <Link key={subLink.label} href={subLink.href} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm uppercase text-gray-600 ${goldHoverColor}`}>
                                    {subLink.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link href={link.href} onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-gray-700 ${goldHoverColor}`}>
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-auto p-4">
                  <Link href="/pay" className={`block w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-5 py-2.5 text-center font-bold text-white transition-all duration-300 hover:shadow-lg`}>
                    Pay Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Sign In Modal */}
      {isSignInOpen && <SignIn isOpen={isSignInOpen} onClose={toggleSignIn} />}
    </div>
  );
};

export default Header;