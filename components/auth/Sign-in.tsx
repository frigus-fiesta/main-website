/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/utils/supabase';

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string; // Add redirectUrl parameter
}

// Interface for IP geolocation data
interface GeoLocation {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

const SignIn: React.FC<SignInProps> = ({ isOpen, onClose, redirectUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);

  const router = useRouter();
  const element_unique_id = useId();

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Function to get the user's IP address and geolocation
  const getIpAndLocation = async (): Promise<GeoLocation | null> => {
    try {
      // First get the IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData:any = await ipResponse.json();
      const ip = ipData.ip;
      const IP_INFO_TOKEN = process.env.NEXT_PUBLIC_IP_INFO_TOKEN || 'db04343f368c67'; // Replace with your actual token
      
      // Then get geolocation data
      const geoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=${IP_INFO_TOKEN}`);
      const geoData:any = await geoResponse.json();
      
      return {
        ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country,
        loc: geoData.loc,
        org: geoData.org,
        postal: geoData.postal,
        timezone: geoData.timezone
      };
    } catch (error) {
      console.error('Error fetching IP or location:', error);
      
      return null;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setAccountNotFound(false);
    const locationInfo = await getIpAndLocation();

    try {
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
 
      if (data?.user) {
        // Check if user exists in profiles_dev table using uuid column
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_dev')
          .select('*')
          .eq('uuid', data.user.id)  // Use 'uuid' column instead of 'id'
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        if (!profileData) {
          // User exists in auth but not in profiles_dev table
          // Create a new profile
          const { error: insertError } = await supabase
            .from('profiles_dev')
            .insert({
              uuid: data.user.id,  // Store user ID in the uuid column
              full_name: data.user.user_metadata?.full_name || '',
              email: data.user.email || '',
              phone: data.user.user_metadata?.phone || '',
              avatar_url: data.user.user_metadata?.avatar_url || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_login_info: {
                last_sign_in: new Date().toISOString(),
                sign_in_count: 1,
                sign_in_method: 'email'
              }
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        } else {
          // Update existing profile with login information
          const currentLoginInfo = profileData.user_login_info || {};
          const signInCount = (currentLoginInfo.sign_in_count || 0) + 1;

          const { error: updateError } = await supabase
            .from('profiles_dev')
            .update({
              updated_at: new Date().toISOString(),
              user_login_info: {
                ...currentLoginInfo,
                last_sign_in: new Date().toISOString(),
                sign_in_count: signInCount,
                sign_in_method: 'email',
                ip_address: locationInfo?.ip || currentLoginInfo.ip_address || 'unknown',
                location: locationInfo ? {
                  city: locationInfo.city || 'unknown',
                  region: locationInfo.region || 'unknown',
                  country: locationInfo.country || 'unknown',
                  coordinates: locationInfo.loc || 'unknown',
                  timezone: locationInfo.timezone || 'unknown'
                } : currentLoginInfo.location || 'unknown'
              }
            })
            .eq('uuid', data.user.id);  // Use 'uuid' column instead of 'id'

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }

        // Close modal and redirect after successful sign-in
        onClose();
        
        // Redirect to the original URL if provided, otherwise refresh the current page
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        // Set account not found message
        setAccountNotFound(true);
        setError('Account not found. Please create an account to continue.');
      } else {
        setError(error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Store the redirect URL in localStorage before redirecting to Google OAuth
      if (redirectUrl) {
        localStorage.setItem('authRedirectUrl', redirectUrl);
      } else {
        // If no redirectUrl is provided, store the current path
        localStorage.setItem('authRedirectUrl', window.location.pathname);
      }

      // Initiate Google OAuth sign-in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account', // Force account selection even if already logged in
            access_type: 'offline' // Get refresh token for server-side use
          }
        },
      });

      if (error) {
        throw error;
      }

      // The auth callback page will handle profile creation/update and redirection
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage('Password reset link sent to your email');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  // eslint-disable-next-line no-unused-vars
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -50,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Modal Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      {/* Modal Content */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className="relative mx-2 flex max-h-[95vh] w-full max-w-[95vw] flex-col overflow-y-auto rounded-xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl sm:max-w-md sm:rounded-3xl sm:p-6 md:p-8"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Close Button */}
          <motion.button
            type='button'
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-400 transition-all duration-300 hover:bg-yellow-50 hover:text-yellow-600"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="size-5" />
          </motion.button>
          <div className="pb-1 pt-2 text-center sm:py-0">
            <motion.div
              className="mb-2 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative h-8 w-24 sm:h-10 sm:w-28 md:h-12 md:w-32">
                <Image
                  src="/assets/friguslogo.svg"
                  alt="Frigus Fiesta Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            <motion.h2
              className="mb-1 text-lg font-extrabold text-gray-900 sm:mb-2 sm:text-2xl md:text-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              className="mb-2 text-xs text-gray-600 sm:mb-4 sm:text-sm md:mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-yellow-600 transition-colors hover:text-yellow-500">
                Sign up
              </Link>
            </motion.p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-2 rounded-lg border-l-4 border-red-500 bg-red-50/80 p-3 backdrop-blur-sm sm:mb-4 sm:rounded-xl sm:p-4 md:mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-start">
                  <AlertCircle className="mr-2 mt-0.5 size-4 flex-shrink-0 text-red-500" />
                  <p className="text-xs font-medium text-red-700 sm:text-sm">{error}</p>
                </div>
                {accountNotFound && (
                  <div className="mt-2 flex items-start sm:mt-3">
                    <Info className="mr-2 mt-0.5 size-3 flex-shrink-0 text-blue-500" />
                    <p className="text-xs text-blue-700">
                      <Link href="/signup" className="font-bold underline">
                        Sign up now
                      </Link> to create a new account.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
            {message && (
              <motion.div
                className="mb-2 rounded-lg border-l-4 border-green-500 bg-green-50/80 p-3 backdrop-blur-sm sm:mb-4 sm:rounded-xl sm:p-4 md:mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-xs font-medium text-green-700 sm:text-sm">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.form
            className="space-y-2 sm:space-y-4 md:space-y-6"
            onSubmit={handleEmailSignIn}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:size-5" />
                <input
                  id={`${element_unique_id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-lg border border-gray-200 bg-white/50 px-10 py-3 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 sm:rounded-xl sm:px-12 sm:py-4"
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:size-5" />
                <input
                  id={`${element_unique_id}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-lg border border-gray-200 bg-white/50 px-10 py-3 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 sm:rounded-xl sm:px-12 sm:py-4"
                  placeholder="Password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 sm:right-4"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 sm:size-5" />
                  ) : (
                    <Eye className="size-4 sm:size-5" />
                  )}
                </motion.button>
              </div>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center">
                <input
                  id={`${element_unique_id}-remember`}
                  name="remember-me"
                  type="checkbox"
                  className="size-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-900 sm:text-sm">
                  Remember me
                </label>
              </div>
              <motion.button
                type="button"
                onClick={handlePasswordReset}
                className="text-xs font-bold text-yellow-600 transition-colors hover:text-yellow-500 sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot password?
              </motion.button>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:px-6 sm:py-4"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : null}
              <span className="hidden sm:inline">Sign in to your account</span>
              <span className="sm:hidden">Sign in</span>
            </motion.button>
          </motion.form>
          <motion.div
            className="mt-4 sm:mt-6 md:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-white/95 px-2 font-medium text-gray-500 sm:px-3 md:px-4">Or continue with</span>
              </div>
            </div>
            <motion.div
              className="mt-3 sm:mt-4 md:mt-6"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white/80 px-4 py-3 text-sm font-bold text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 disabled:opacity-70 sm:rounded-xl sm:px-6 sm:py-4"
              >
                <svg className="mr-2 size-5" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Google</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignIn;