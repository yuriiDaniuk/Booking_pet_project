"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Share,
  Heart,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  Star
} from 'lucide-react';
import Image from 'next/image';

import api from '../../../lib/api';


// --- Sub-components ---

function PropertySearchHeader() {
  const router = useRouter();

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex-1 flex gap-2">

          <div className="flex-1 hidden md:flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 transition-colors cursor-pointer">
            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Dates</span>
              <span className="text-sm font-medium text-gray-900">Sun, May 24 - Mon, May 25</span>
            </div>
          </div>

          <div className="flex-1 hidden lg:flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 transition-colors cursor-pointer">
            <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Travelers</span>
              <span className="text-sm font-medium text-gray-900">2 travelers, 1 room</span>
            </div>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors shadow-sm">
          Search
        </button>
      </div>
    </div>
  );
}

function PropertyGallery({ images }: { images: string[] }) {
  return (
    <div className="mt-6 mb-8 relative group rounded-2xl overflow-hidden">
      {/* Floating Actions */}
      <div className="absolute top-4 right-4 z-10 flex gap-3">
        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-medium text-sm text-gray-900 hover:bg-white transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <Share className="w-4 h-4" /> Share
        </button>
        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-medium text-sm text-gray-900 hover:bg-white transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <Heart className="w-4 h-4 text-rose-500" /> Save
        </button>
      </div>

      {/* Photo count button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg font-medium text-sm text-white hover:bg-black/80 transition-colors shadow-lg">
          <ImageIcon className="w-4 h-4" /> {images.length}+
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] sm:h-[500px]">
        {/* Main Image */}
        <div className="relative h-full w-full overflow-hidden group/main cursor-pointer">
          <img
            src={images[0]}
            alt="Property Main"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/main:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover/main:bg-black/0 transition-colors duration-300"></div>
        </div>

        {/* Right 2x2 Grid */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="relative h-full w-full overflow-hidden group/thumb cursor-pointer">
              <img
                src={img}
                alt={`Property view ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/0 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickyPageNav() {
  const [active, setActive] = useState('Overview');
  const items = ['Overview', 'Rooms'];

  return (
    <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-20 z-40 mb-10">
      <div className="flex items-center justify-between">
        <nav className="flex overflow-x-auto no-scrollbar">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-300 ${active === item
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors mr-2">
          Select a room
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/properties/${resolvedParams.id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching property:', err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading property...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Property not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <PropertySearchHeader />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <PropertyGallery images={data.images || []} />

        <StickyPageNav />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Header Block */}
            <section className="flex flex-col gap-4 bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100/50">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-200/80 text-yellow-900 text-xs font-bold px-2 py-1 rounded tracking-wide uppercase">
                  {data.badge}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(data.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gray-700 text-gray-700" />
                  ))}
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                {data.title}
              </h1>

              <div className="flex items-center gap-3 mt-1">
                <div className="bg-emerald-700 text-white font-bold rounded-md px-2.5 py-1 text-sm">
                  {data.ratingScore}
                </div>
                <div className="flex items-center text-sm font-medium gap-1.5">
                  <span className="text-gray-900">{data.ratingStatus}</span>
                  <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
                    {data.reviewsCount} reviews <ChevronRight className="w-4 h-4 inline-block -ml-1" />
                  </span>
                </div>
              </div>
            </section>

            {/* Description Block */}
            <section className="prose prose-gray max-w-none">
              {data.description.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className={i === 0 ? "text-lg font-semibold leading-snug mb-4" : "text-base text-gray-700 leading-relaxed"}>
                  {paragraph}
                </p>
              ))}
            </section>



          </div>

          {/* RIGHT COLUMN - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{data.location}</p>
                  <p className="text-sm mt-1">{data.address}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
