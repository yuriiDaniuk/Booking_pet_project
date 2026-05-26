"use client";

import React, { useState } from 'react';
import { Calendar, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      router.push(`/?${params.toString()}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Lviv_Opera.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Header (Top Navigation) */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 text-white">
        {/* Left side: Logo text */}
        <div className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer" onClick={() => router.push('/')}>
          LvivStay
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-sm md:text-base font-semibold tracking-wide">
          <a href="#" className="hover:text-gray-300 transition-colors uppercase">Famous Places</a>
          <a href="#" className="hover:text-gray-300 transition-colors uppercase">Local Cuisine</a>
        </nav>

        {/* Right side: Sign Up button */}
        <div className="flex items-center gap-4">
          <button className="bg-[#487a74] hover:bg-[#3d6863] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg uppercase text-sm tracking-wide">
            Sign Up
          </button>
          {/* Optional Hamburger for Mobile */}
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Content & Search Bar */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-100px)] px-4">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-light mb-12 text-center tracking-wider">
          Book now your next <span className="text-blue-200 font-medium">adventure</span>
        </h1>

        {/* Search Bar Container */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row items-center w-full max-w-4xl border border-white/20 rounded-2xl md:rounded-full overflow-hidden">

          {/* Check In */}
          <div className="flex-1 flex items-center px-6 py-4 md:py-5 border-b md:border-b-0 md:border-r border-gray-300/60 w-full md:w-auto hover:bg-white/50 transition">
            <Calendar className="text-gray-500 h-5 w-5 mr-3" />
            <div className="flex flex-col w-full">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Check In</span>
              <input 
                type="date" 
                className="bg-transparent border-none outline-none text-gray-900 font-medium w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="flex-1 flex items-center px-6 py-4 md:py-5 border-b md:border-b-0 md:border-r border-gray-300/60 w-full md:w-auto hover:bg-white/50 transition">
            <Calendar className="text-gray-500 h-5 w-5 mr-3" />
            <div className="flex flex-col w-full">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Check Out</span>
              <input 
                type="date" 
                className="bg-transparent border-none outline-none text-gray-900 font-medium w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="px-4 py-4 md:py-2 w-full md:w-auto bg-white/90 md:bg-transparent">
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#487a74] hover:bg-[#3d6863] text-white px-10 py-4 rounded-full font-bold transition-colors shadow-md flex items-center justify-center tracking-wide uppercase"
            >
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
