'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { supabase } from '@/utils/supabase';

const BACKEND_PROFILE_URL = 'https://backend-server.developer-frigus-fiesta.workers.dev/general/create-profile';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('Processing login...');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus('loading');
        setMessage('Checking authentication...');
        setErrorDetail(null);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setStatus('error');
          setMessage('Authentication failed.');
          setErrorDetail('No user session found. Please try signing in again.');
          
return;
        }

        const user = session.user;
        const uuid = user.id;
        const email = user.email || '';
        const full_name = user.user_metadata?.full_name || user.user_metadata?.name || '';
        const avatar_url = user.user_metadata?.avatar_url || '';

        setMessage('Setting up your account...');
        const response = await fetch(BACKEND_PROFILE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid, email, full_name, avatar_url }),
        });

        const result:any = await response.json();

        if (!response.ok || !result.success) {
          setStatus('error');
          setMessage('Profile creation failed.');
          setErrorDetail(result.message || 'Failed to create profile. Please contact support.');
          
return;
        }

        // Success: redirect to stored URL or home
        let redirectTo = '/';
        if (typeof window !== 'undefined') {
          const storedRedirectUrl = localStorage.getItem('authRedirectUrl');
          if (storedRedirectUrl) {
            redirectTo = storedRedirectUrl;
            localStorage.removeItem('authRedirectUrl');
          }
        }
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => router.push(redirectTo), 1200);
      } catch (err: any) {
        setStatus('error');
        setMessage('Unexpected error. Please try again.');
        setErrorDetail(err?.message || 'Unknown error');
        console.error('Error in auth callback:', err);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-xs rounded-xl bg-white/90 p-6 text-center shadow-xl">
        <div className="mb-4 flex justify-center">
          <Image
            src="/assets/friguslogo.svg"
            alt="Frigus Fiesta Logo"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
        </div>
        {status === 'loading' && (
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
        )}
        <p className="mb-2 text-lg font-bold text-gray-900">{message}</p>
        {status === 'error' && (
          <>
            <p className="mb-2 text-sm text-red-600">{errorDetail}</p>
            <button
              className="mt-2 rounded bg-yellow-500 px-4 py-2 font-semibold text-white shadow hover:bg-yellow-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <button
              className="ml-2 mt-2 rounded bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-300"
              onClick={() => router.push('/')}
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}