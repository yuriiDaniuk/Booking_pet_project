import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Use the raw postgres URL from prisma dev output
const connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'owner@lvivstay.com' },
    update: {},
    create: {
      email: 'owner@lvivstay.com',
      name: 'LvivStay Host',
      passwordHash: 'dummyhash',
      role: 'HOST',
    },
    include: {
      properties: true,
      bookings: true,
    },
  });

  const properties = [
    {
      id: 'w-prague',
      title: 'W Prague',
      description: "Splendid sanctuary in historic Prague\n\nArtfully designed restaurants invite guests into a culinary journey at Prague's heart. The unique spa features a hot tub and indoor pool, creating a relaxation oasis after city exploration. Friendly staff provide attentive service throughout, from the Poppy Lounge to Minus One bar.",
      type: 'Hotel',
      badge: 'Luxury',
      stars: 5,
      ratingScore: 9.8,
      ratingStatus: 'Exceptional',
      reviewsCount: 83,
      pricePerNight: 8500,
      oldPrice: 10500,
      location: 'Prague, Czechia',
      address: 'VACLAVSKE NAMESTI 826/25',
      images: [
        'https://images.unsplash.com/photo-1542314831-c6a4d1409385?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
      ],
      ownerId: owner.id,
    },
    {
      id: 'opera-center',
      title: 'Opera Center Hotel & Apartments',
      description: 'Comfortable stay in the heart of Lviv.',
      type: 'Apartment',
      badge: 'Genius',
      stars: 3,
      ratingScore: 9.1,
      ratingStatus: 'Excellent',
      reviewsCount: 34,
      pricePerNight: 1960,
      oldPrice: 2400,
      location: 'Lviv, Ukraine',
      address: 'Prospekt Svobody, 32',
      images: ['/Lviv_Opera.jpg'],
      ownerId: owner.id,
    },
    {
      id: 'demar-apart',
      title: 'DeMar Apart Tiffani',
      description: 'Luxury guest house near central Lviv.',
      type: 'Guest House',
      badge: 'Genius',
      stars: 4,
      ratingScore: 9.6,
      ratingStatus: 'Exceptional',
      reviewsCount: 168,
      pricePerNight: 1872,
      oldPrice: 2600,
      location: 'Lviv, Ukraine',
      address: 'Virmenska St, 17/1',
      images: ['/Lviv_Opera.jpg'],
      ownerId: owner.id,
    },
    {
      id: 'stories-hub',
      title: 'Stories Hub',
      description: 'Popular hub for travelers in Lviv.',
      type: 'Guest House',
      badge: 'Genius',
      stars: 4,
      ratingScore: 9.1,
      ratingStatus: 'Excellent',
      reviewsCount: 1827,
      pricePerNight: 2361,
      oldPrice: 3320,
      location: 'Lviv, Ukraine',
      address: 'Zhovkivska St, 27',
      images: ['/Lviv_Opera.jpg'],
      ownerId: owner.id,
    },
    {
      id: 'apartments-lviv',
      title: 'Apartments in Lviv on Pid Holoskom Street',
      description: 'Cozy apartments in residential Lviv.',
      type: 'Apartment',
      badge: 'Genius',
      stars: 3,
      ratingScore: 8.5,
      ratingStatus: 'Very Good',
      reviewsCount: 120,
      pricePerNight: 1560,
      oldPrice: 2178,
      location: 'Lviv, Ukraine',
      address: 'Pid Holoskom Street, 14',
      images: ['/Lviv_Opera.jpg'],
      ownerId: owner.id,
    }
  ];

  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: property,
      create: property,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
