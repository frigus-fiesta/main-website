// app/events/live/[slug]/page.tsx
import LiveEventSlugPage from './LiveEventClientPage';

interface EventData {
  id: number;
  title: string;
  description: string;
  slug: string;
  eventDate: string;
  tagline: string;
  eventStatus: string;
  category: string;
  hostedBy: string;
  venue: string;
  imageGallery: string;
  eventPrice: number;
  ticketPricingList: string;
  importantInfo: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await fetch(
      'https://backend-server.frigus-fiesta.workers.dev/general/get-all-events',
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const result: any = await res.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch events');
    }

    const foundEvent = result.data.find(
      (e: EventData) => e.slug === slug && e.category.toLowerCase() === 'live'
    );

    if (!foundEvent) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
          Event not found or not a live event
        </div>
      );
    }

    return <LiveEventSlugPage event={foundEvent} />;
  } catch (err: any) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Error loading event: {err.message}
      </div>
    );
  }
}
