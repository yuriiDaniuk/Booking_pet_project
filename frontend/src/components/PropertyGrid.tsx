"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, MapPinned, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import api from '../lib/api';

export default function PropertyGrid() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [imageHeight, setImageHeight] = useState(0);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    api.get('/properties', { params })
      .then(res => {
        const mappedProperties = res.data.map((p: any) => ({
          id: p.id,
          type: p.type,
          stars: p.stars,
          name: p.title,
          location: p.location,
          score: p.ratingScore,
          reviewStatus: p.ratingStatus,
          reviewCount: p.reviewsCount,
          distance: p.distance,
          oldPrice: p.oldPrice ? `UAH ${p.oldPrice.toLocaleString()}` : null,
          newPrice: `UAH ${p.pricePerNight.toLocaleString()}`,
          image: p.images && p.images.length > 0 ? p.images[0] : '/Lviv_Opera.jpg'
        }));
        setProperties(mappedProperties);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
        setLoading(false);
      });
  }, [startDate, endDate]);

  const updateHeight = React.useCallback(() => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [updateHeight]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    // Re-check after a short delay to account for initial render layout
    setTimeout(checkScroll, 100);
  }, [itemsPerPage]);

  const next = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0].clientWidth;
      scrollContainerRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' }); // 24px is gap-6
    }
  };

  const prev = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0].clientWidth;
      scrollContainerRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const getCardStyle = () => {
    if (itemsPerPage === 1) return { flex: '0 0 100%', maxWidth: '100%' };
    if (itemsPerPage === 2) return { flex: '0 0 calc((100% - 24px) / 2)', maxWidth: 'calc((100% - 24px) / 2)' };
    return { flex: '0 0 calc((100% - 72px) / 4)', maxWidth: 'calc((100% - 72px) / 4)' };
  };

  return (
    <div className="w-full py-8 px-10 relative group">

      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={prev}
          style={{ top: `calc(32px + ${imageHeight / 2}px)` }}
          className="absolute left-2 md:left-6 -translate-y-1/2 z-20 bg-white rounded-full p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)] border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Previous property"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={next}
          style={{ top: `calc(32px + ${imageHeight / 2}px)` }}
          className="absolute right-2 md:right-6 -translate-y-1/2 z-20 bg-white rounded-full p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.2)] border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Next property"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Slider Container Wrapper */}
      <div className="w-full relative">
        {/* Inner track that moves */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {properties.map((property, index) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              style={getCardStyle()}
              className="snap-start block"
            >
              <div
                className="bg-white rounded-lg cursor-pointer shadow-md border border-gray-200 overflow-hidden flex flex-col h-full"
              >

                {/* Property Image Section */}
                <div
                  ref={index === 0 ? imageRef : null}
                  className="relative aspect-[4/3] w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col gap-y-3 flex-grow">

                  {/* Top Row: Type, Stars */}
                  <div className="flex items-center gap-1.5 h-5 overflow-hidden">
                    <span className="text-xs text-gray-700 truncate max-w-[140px]">{property.type}</span>
                    <div className="flex flex-shrink-0">
                      {[...Array(property.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Title and Location Fixed Container */}
                  <div className="h-[4.5rem] flex flex-col gap-y-1">
                    {/* Property Name */}
                    <h3 className="font-bold text-[17px] leading-tight line-clamp-2 text-gray-900" title={property.name}>
                      {property.name}
                    </h3>

                    {/* Location */}
                    <div className="text-gray-600 text-[13px] flex gap-x-1 items-center underline decoration-dashed decoration-gray-400 cursor-pointer w-full max-w-full">
                      <span className="truncate" title={property.location}>{property.location}</span>
                    </div>
                  </div>

                  {/* Rating & Reviews Block */}
                  <div className="flex items-center gap-x-2 mt-1">
                    <div className="bg-blue-800 text-white font-bold rounded p-1.5 text-sm flex items-center justify-center w-8 h-8">
                      {property.score}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900 text-[13px] font-medium leading-none mb-1">{property.reviewStatus}</span>
                      <span className="text-gray-600 text-[12px] leading-none">{property.reviewCount} reviews</span>
                    </div>
                  </div>

                  {/* Distance Block */}
                  <div className="text-gray-600 text-[13px] flex items-center gap-x-1.5 mt-2 truncate w-full" title={property.distance}>
                    <MapPinned className="w-4 h-4 text-gray-700 flex-shrink-0" />
                    <span className="truncate">{property.distance}</span>
                  </div>

                  {/* Pricing Block */}
                  <div className="text-right mt-auto pt-4 flex flex-col items-end">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">From</span>
                    {property.oldPrice && (
                      <span className="text-red-500 line-through text-xs font-medium decoration-red-500 decoration-1.5">
                        {property.oldPrice}
                      </span>
                    )}
                    <span className="font-bold text-lg text-gray-900 leading-tight">
                      {property.newPrice}
                    </span>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
