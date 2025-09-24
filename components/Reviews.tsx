/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react'; // just pushing this to main branch to test CI pipelines 
import Image from 'next/image';
import { Star, ThumbsUp, User, Loader2, AlertCircle } from 'lucide-react';

import SignIn from './auth/Sign-in';

import { supabase } from '@/utils/supabase';

interface ReviewsProps {
  slug: string;
}

interface Review {
  id: number;
  review_of: string;
  uuid: string;
  comment: string;
  rate: number;
  like_count: number;
  commented_on: string;
}

interface UserProfile {
  uuid: string;
  full_name: string;
  avatar_url: string;
}

const REVIEWS_URL = 'https://backend-server.developer-frigus-fiesta.workers.dev/general/get-event-reviews/';
const PROFILE_URL = 'https://backend-server.developer-frigus-fiesta.workers.dev/general/get-user-profile-from-uuid/';
const SUBMIT_REVIEW_URL = 'https://backend-server.developer-frigus-fiesta.workers.dev/general/submit-event-review';

const Reviews: React.FC<ReviewsProps> = ({ slug }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);

  // Fetch reviews for the event
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      setReviews([]);
      setUserProfiles({});
      try {
        const res = await fetch(`${REVIEWS_URL}${slug}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data:any = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch reviews');
        if (!isMounted) return;
        setReviews(data.data || []);
        // Fetch all user profiles in parallel
        const uuids = Array.from(new Set((data.data || []).map((r: Review) => r.uuid)));
        const profileResults = await Promise.all(
          uuids.map(async (uuid) => {
            try {
              const res = await fetch(`${PROFILE_URL}${uuid}`);
              if (!res.ok) throw new Error();
              const profileData:any = await res.json();
              if (profileData.success && profileData.data) {
                return [uuid, {
                  uuid,
                  full_name: profileData.data.full_name || 'User',
                  avatar_url: profileData.data.avatar_url || '',
                }];
              }
            } catch {}
            
return [uuid, { uuid, full_name: 'User', avatar_url: '' }];
          })
        );
        if (!isMounted) return;
        setUserProfiles(Object.fromEntries(profileResults));
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load reviews');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();
    
return () => { isMounted = false; };
  }, [slug]);

  // Check auth session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsSignInOpen(false);
    });
    
return () => { subscription.unsubscribe(); };
  }, []);

  // Helper to format date
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Helper to render stars
  const renderStars = (rate: number, onClick?: (r: number) => void) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star
          key={i}
          className={`size-5 cursor-pointer transition-colors ${i <= rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          onClick={onClick ? () => onClick(i) : undefined}
        />
      ))}
    </div>
  );

  // Add review submit handler
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!session || !session.user) {
      setIsSignInOpen(true);
      
return;
    }
    if (!comment.trim() || rate < 1) {
      setSubmitError('Please provide a comment and a rating.');
      
return;
    }
    setSubmitting(true);
    try {
      const payload = {
        uuid: session.user.id,
        review_of: slug,
        comment: comment.trim(),
        rate,
      };
      const res = await fetch(SUBMIT_REVIEW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data:any = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to submit review');
      setSubmitSuccess('Review submitted!');
      setComment('');
      setRate(0);
      setAddReviewOpen(false);
      // Refresh reviews
      setTimeout(() => setSubmitSuccess(null), 3000);
      setLoading(true);
      // Refetch reviews
      const refetch = await fetch(`${REVIEWS_URL}${slug}`);
      const refetchData:any = await refetch.json();
      setReviews(refetchData.data || []);
      // Refetch user profiles for new reviews
      const uuids = Array.from(new Set((refetchData.data || []).map((r: Review) => r.uuid)));
      const profileResults = await Promise.all(
        uuids.map(async (uuid) => {
          try {
            const res = await fetch(`${PROFILE_URL}${uuid}`);
            if (!res.ok) throw new Error();
            const profileData:any = await res.json();
            if (profileData.success && profileData.data) {
              return [uuid, {
                uuid,
                full_name: profileData.data.full_name || 'User',
                avatar_url: profileData.data.avatar_url || '',
              }];
            }
          } catch {}
          
return [uuid, { uuid, full_name: 'User', avatar_url: '' }];
        })
      );
      setUserProfiles(Object.fromEntries(profileResults));
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>
      {/* Add Review Section */}
      <div className="mb-8">
        {session && session.user ? (
          <>
            {!addReviewOpen ? (
              <button
                className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-2 font-bold text-white shadow hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onClick={() => setAddReviewOpen(true)}
              >
                Add Review
              </button>
            ) : (
              <form onSubmit={handleAddReview} className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-md">
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-medium text-gray-700">Your Rating:</span>
                  {renderStars(rate, setRate)}
                </div>
                <textarea
                  className="mb-3 w-full rounded-lg border border-gray-300 bg-white/80 p-3 text-gray-800 shadow focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                  rows={3}
                  placeholder="Write your review..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  required
                />
                {submitError && <div className="mb-2 text-sm text-red-600">{submitError}</div>}
                {submitSuccess && <div className="mb-2 text-sm text-green-600">{submitSuccess}</div>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 font-bold text-white shadow hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-gray-500 px-6 py-2 font-bold text-white shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => { setAddReviewOpen(false); setComment(''); setRate(0); setSubmitError(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <button
            className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-2 font-bold text-white shadow hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onClick={() => setIsSignInOpen(true)}
          >
            Add Review
          </button>
        )}
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-4 size-10 animate-spin text-yellow-500" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border-l-4 border-red-500 bg-red-50/80 p-4">
          <AlertCircle className="size-5 text-red-500" />
          <span className="font-medium text-red-700">{error}</span>
        </div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <div className="py-12 text-center text-gray-500">No reviews yet for this event.</div>
      )}
      <div className="space-y-6">
        {reviews.map((review) => {
          const user = userProfiles[review.uuid];

          return (
            <div key={review.id} className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white/80 p-4 shadow sm:flex-row sm:p-6">
              {/* Avatar */}
              <div className="flex shrink-0 items-center justify-center">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    width={56}
                    height={56}
                    className="size-14 rounded-full border-2 border-yellow-200 bg-white object-cover"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-full bg-yellow-100">
                    <User className="size-7 text-yellow-500" />
                  </div>
                )}
              </div>
              {/* Review Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-gray-900">{user?.full_name || 'User'}</span>
                    {renderStars(review.rate)}
                  </div>
                  <span className="text-xs text-gray-400 sm:text-right">{formatDate(review.commented_on)}</span>
                </div>
                <p className="mt-2 break-words text-base text-gray-800">{review.comment}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <ThumbsUp className="size-4 text-yellow-400" />
                  <span>{review.like_count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Sign In Modal */}
      {isSignInOpen && <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />}
    </div>
  );
};

export default Reviews;
