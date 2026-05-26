"use client";

import Hero from '@/components/Hero';
import PropertyGrid from '@/components/PropertyGrid';
import { Suspense } from 'react';

export default function Feed() {
  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header & Search */}
      <Hero />

      {/* Property Grid with SearchParams */}
      <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading properties...</div>}>
        <PropertyGrid />
      </Suspense>
    </div>
  );
}
