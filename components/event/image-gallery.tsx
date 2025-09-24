/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface EventData {
  id: number;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  tagline: string;
  eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  hostedBy: string;
  venue: string;
  imageGallery: string;
  eventPrice: string | number;
  ticketPricingList: string;
  importantInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageGalleryProps {
  slug: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ slug }) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://backend-server.developer-frigus-fiesta.workers.dev/general/get-all-events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const result:any = await response.json();
      if (result.success) {
        const foundEvent = result.data.find((e: EventData) => e.slug === slug);
        if (foundEvent) {
          setEvent(foundEvent);
          try {
            const imageData = JSON.parse(foundEvent.imageGallery);
            setImages(Array.isArray(imageData) ? imageData : []);
          } catch {
            setImages([]);
          }
        } else {
          setError('Event not found');
        }
      } else {
        throw new Error(result.message || 'Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchEventData();
    }
  }, [slug]);

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      setDownloading(index);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(null);
    }
  };

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading event images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="size-12 text-red-500" />
          <p className="text-lg font-medium text-gray-900">Error Loading Images</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchEventData}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event || images.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">No Images Available</p>
          <p className="text-gray-600">This event doesn't have any images yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Image Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={image}
                alt={`${event.title} - Image ${index + 1}`}
                width={400}
                height={400}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => setSelectedImage(index)}
              />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(index)}
                    className="rounded-full bg-white p-2 text-gray-800 shadow-lg transition-all hover:bg-gray-100"
                  >
                    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => downloadImage(image, index)}
                    disabled={downloading === index}
                    className="rounded-full bg-white p-2 text-gray-800 shadow-lg transition-all hover:bg-gray-100 disabled:opacity-50"
                  >
                    {downloading === index ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Download className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Image Number */}
            <div className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
              {index + 1} / {images.length}
            </div>
          </div>
        ))}
      </div>
      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-h-full max-w-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 z-10 rounded-full bg-white p-2 text-gray-800 shadow-lg transition-all hover:bg-gray-100"
            >
              <X className="size-6" />
            </button>
            {/* Navigation Buttons */}
            {selectedImage > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-gray-100"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}
            {selectedImage < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-gray-100"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
            {/* Main Image */}
            <div className="relative">
              <Image
                src={images[selectedImage]}
                alt={`${event.title} - Image ${selectedImage + 1}`}
                width={800}
                height={600}
                className="max-h-[80vh] max-w-full object-contain"
              />
              {/* Download Button */}
              <button
                onClick={() => downloadImage(images[selectedImage], selectedImage)}
                disabled={downloading === selectedImage}
                className="absolute bottom-4 right-4 rounded-full bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-gray-100 disabled:opacity-50"
              >
                {downloading === selectedImage ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <Download className="size-6" />
                )}
              </button>
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black bg-opacity-50 px-3 py-2 text-sm text-white">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
      {/* Image Count */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {images.length} image{images.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
};

export default ImageGallery;
