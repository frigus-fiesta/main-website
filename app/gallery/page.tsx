"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import Header from '@/components/Header';
import Footer from "@/components/Footer-dark-theme";

interface ImageItem {
  id: number;
  url: string;
  alt: string;
  width: number; 
  height: number;
  span: string;
  aspectRatio?: number; 
}

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

const pexelsImages: ImageItem[] = [
    {
      id: 1,
      url: "/assets/1.JPG",
      alt: "🏔️",
      width: 600,
      height: 800,
      span: "col-span-1 row-span-2"
    },
    {
      id: 2,
      url: "/assets/2.JPG",
      alt: "🏢",
      width: 800,
      height: 600,
      span: "col-span-2 row-span-1"
    },
    {
      id: 3,
      url: "/assets/3.JPG",
      alt: "🌅",
      width: 600,
      height: 600,
      span: "col-span-1 row-span-1"
    },
    {
      id: 4,
      url: "/assets/4.JPG",
      alt: "🌃",
      width: 400,
      height: 600,
      span: "col-span-1 row-span-2"
    },
    {
      id: 5,
      url: "/assets/5.JPG",
      alt: "📸",
      width: 600,
      height: 400,
      span: "col-span-2 row-span-1"
    },
    {
      id: 6,
      url: "/assets/6.JPG",
      alt: "☕",
      width: 500,
      height: 500,
      span: "col-span-1 row-span-1"
    },
    {
      id: 7,
      url: "/assets/7.JPG",
      alt: "💦",
      width: 800,
      height: 600,
      span: "col-span-2 row-span-1"
    },
    {
      id: 8,
      url: "/assets/8.JPG",
      alt: "🥾",
      width: 400,
      height: 500,
      span: "col-span-1 row-span-1"
    },
    {
      id: 9,
      url: "/assets/9.JPG",
      alt: "🏛️",
      width: 500,
      height: 800,
      span: "col-span-1 row-span-2"
    },
    {
      id: 10,
      url: "/assets/10.JPG",
      alt: "🧗",
      width: 600,
      height: 450,
      span: "col-span-2 row-span-1"
    },
    {
      id: 11,
      url: "/assets/11.JPG",
      alt: "🍲",
      width: 500,
      height: 500,
      span: "col-span-1 row-span-1"
    },
    {
      id: 12,
      url: "/assets/12.JPG",
      alt: "🪴",
      width: 600,
      height: 700,
      span: "col-span-1 row-span-2"
    },
    {
      id: 13,
      url: "/assets/13.JPG",
      alt: "⛰️",
      width: 700,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 14,
      url: "/assets/14.JPG",
      alt: "🏜️",
      width: 500,
      height: 750,
      span: "col-span-1 row-span-2"
    },
    {
      id: 15,
      url: "/assets/15.JPG",
      alt: "🌲",
      width: 600,
      height: 400,
      span: "col-span-2 row-span-1"
    },
    {
      id: 16,
      url: "/assets/16.JPG",
      alt: "🏗️",
      width: 450,
      height: 600,
      span: "col-span-1 row-span-1"
    },
    {
      id: 17,
      url: "/assets/17.JPG",
      alt: "🌄",
      width: 800,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 18,
      url: "/assets/18.JPG",
      alt: "🏠",
      width: 500,
      height: 650,
      span: "col-span-1 row-span-2"
    },
    {
      id: 19,
      url: "/assets/19.JPG",
      alt: "✨",
      width: 700,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 20,
      url: "/assets/20.JPG",
      alt: "🌱",
      width: 500,
      height: 500,
      span: "col-span-1 row-span-1"
    },
    {
      id: 21,
      url: "/assets/21.JPG",
      alt: "🏝️",
      width: 800,
      height: 600,
      span: "col-span-2 row-span-1"
    },
    {
      id: 22,
      url: "/assets/22.JPG",
      alt: "🛕",
      width: 400,
      height: 600,
      span: "col-span-1 row-span-2"
    },
    {
      id: 23,
      url: "/assets/23.JPG",
      alt: "🏙️",
      width: 700,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 24,
      url: "/assets/24.JPG",
      alt: "📷",
      width: 600,
      height: 400,
      span: "col-span-2 row-span-1"
    },
    {
      id: 25,
      url: "/assets/25.JPG",
      alt: "🌇",
      width: 500,
      height: 800,
      span: "col-span-1 row-span-2"
    },
    {
      id: 26,
      url: "/assets/26.JPG",
      alt: "🌁",
      width: 600,
      height: 600,
      span: "col-span-1 row-span-1"
    },
    {
      id: 27,
      url: "/assets/27.JPG",
      alt: "🚠",
      width: 700,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 28,
      url: "/assets/28.JPG",
      alt: "🏞️",
      width: 500,
      height: 750,
      span: "col-span-1 row-span-2"
    },
    {
      id: 29,
      url: "/assets/29.JPG",
      alt: "🗻",
      width: 600,
      height: 400,
      span: "col-span-2 row-span-1"
    },
    {
      id: 30,
      url: "/assets/31.JPG",
      alt: "🪂",
      width: 450,
      height: 600,
      span: "col-span-1 row-span-1"
    },
    {
      id: 31,
      url: "/assets/31.JPG",
      alt: "🛤️",
      width: 800,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 32,
      url: "/assets/32.JPG",
      alt: "🪵",
      width: 500,
      height: 650,
      span: "col-span-1 row-span-2"
    },
    {
      id: 33,
      url: "/assets/33.JPG",
      alt: "🎡",
      width: 700,
      height: 500,
      span: "col-span-2 row-span-1"
    },
    {
      id: 34,
      url: "/assets/34.JPG",
      alt: "🎢",
      width: 500,
      height: 500,
      span: "col-span-1 row-span-1"
    },
    {
      id: 35,
      url: "/assets/35.JPG",
      alt: "🌌",
      width: 800,
      height: 600,
      span: "col-span-2 row-span-1"
    },
    {
      id: 36,
      url: "/assets/36.JPG",
      alt: "🌉",
      width: 600,
      height: 700,
      span: "col-span-1 row-span-2"
    }
  ];
  
const GalleryPage: React.FC = () => {
  const [columns, setColumns] = useState<number>(4);
  const [columnImages, setColumnImages] = useState<ImageItem[][]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth < 640) {
        setColumns(2);
      } else if (window.innerWidth < 768) {
        setColumns(3);
      } else if (window.innerWidth < 1024) {
        setColumns(4);
      } else if (window.innerWidth < 1280) {
        setColumns(5);
      } else {
        setColumns(6);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const processedImages = pexelsImages.map(img => ({
      ...img,
      aspectRatio: img.width / img.height
    }));
    const balancedColumns = balanceColumns(processedImages, columns);
    setColumnImages(balancedColumns);
  }, [columns]);

  const balanceColumns = (images: ImageItem[], numColumns: number): ImageItem[][] => {
    const cols: ImageItem[][] = Array.from({ length: numColumns }, () => []);
    const columnHeights = Array(numColumns).fill(0);
    
    images.forEach(image => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      cols[shortestColumnIndex].push(image);
      const estimatedHeight = 300 / image.aspectRatio!; 
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });
    
    return cols;
  };

  const openModal = (image: ImageItem): void => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = useCallback((direction: 'prev' | 'next'): void => {
    if (!selectedImage) return;
    const currentIndex = pexelsImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % pexelsImages.length;
    } else {
      newIndex = currentIndex === 0 ? pexelsImages.length - 1 : currentIndex - 1;
    }
    setSelectedImage(pexelsImages[newIndex]);
  }, [selectedImage]);

  const calculateImageHeight = (image: ImageItem): number => {
    const baseWidth = 300;
    const aspectRatio = image.width / image.height;
    let height = baseWidth / aspectRatio;
    
    const variance = Math.random() * 60 - 30; // -30 to +30
    height += variance;
    
    return Math.max(200, Math.min(500, height));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    
return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage, navigateImage]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GoldAnimatedBackground />
      <Header/>
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
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        <div className={`relative z-10 flex h-full items-center justify-center px-6 text-center transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span className="animate-text-shimmer inline-block text-white">
                Our Gallery
              </span>
            </h1>
            <p className={`text-md mb-8 leading-relaxed text-amber-100 transition-all delay-300 duration-1000 ease-out md:text-lg ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Discover extraordinary experiences crafted for corporate excellence, 
              live entertainment, and unforgettable social celebrations
            </p>
            <div className={`flex flex-col justify-center gap-4 transition-all delay-500 duration-1000 ease-out sm:flex-row ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <button className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300">
                Explore Events
              </button>
              <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300">
                View Gallerty
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <div className="relative min-h-screen pb-10 pt-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className={`grid gap-4 ${
            columns === 2 ? 'grid-cols-2' : 
            columns === 3 ? 'grid-cols-3' : 
            columns === 4 ? 'grid-cols-4' : 
            columns === 5 ? 'grid-cols-5' : 
            'grid-cols-6'
          }`}>
            {columnImages.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-4">
                {column.map((image) => {
                  const dynamicHeight = calculateImageHeight(image);
                  
                  return (
                    <div
                      key={image.id}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/50"
                      style={{ height: `${dynamicHeight}px` }}
                      onClick={() => openModal(image)}
                    >
                      <div className="relative size-full overflow-hidden rounded-2xl">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-90 transition-opacity duration-300">
                          <div className="flex justify-end">
                            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                              <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-white">{image.alt}</span>
                            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                              <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-4xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 z-10 text-white transition-colors hover:text-gray-300"
              >
                <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-2xl bg-white" style={{ maxHeight: '80vh' }}>
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 90vw, 800px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer/>
    </div>
  );
};

export default GalleryPage;