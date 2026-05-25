"use client";

import Hero from '@/components/Hero';
import Link from 'next/link';
import PropertyGrid from '@/components/PropertyGrid';
import { useRouter } from 'next/navigation';
import { Home, Heart, User, Search } from 'lucide-react';


export default function Feed() {
  const router = useRouter();

  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <Hero />

      {/* Property Grid */}
      <PropertyGrid />

      <PropertyGrid />

      <PropertyGrid />

    </div>
  );
}
