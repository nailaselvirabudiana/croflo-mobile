import { addOrUpdatePlace, Place } from '../services/firestore';

const PLACES_TO_SEED: Place[] = [
  {
    id: 'jabarano-coffee-dago',
    name: 'Jabarano Coffee Dago',
    description: 'A cozy coffee shop in the heart of Dago, perfect for hanging out or working.',
    latitude: -6.890, 
    longitude: 107.615, 
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
    category: 'Cafe'
  },
  {
    id: 'bagikopi-dago',
    name: 'Bagikopi Dago',
    description: 'Popular local coffee chain offering affordable and delicious coffee with a nice ambiance.',
    latitude: -6.888, 
    longitude: 107.616, 
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
    category: 'Cafe'
  },
  {
    id: 'membuai-ciumbuleuit',
    name: 'Membuai Ciumbuleuit',
    description: 'A hidden gem in Ciumbuleuit with great views and relaxing atmosphere.',
    latitude: -6.879, 
    longitude: 107.604, 
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80',
    category: 'Restaurant'
  },
  {
    id: 'institut-teknologi-bandung',
    name: 'Institut Teknologi Bandung (ITB)',
    description: 'One of the oldest and most prestigious engineering universities in Indonesia.',
    latitude: -6.891, 
    longitude: 107.610, 
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
    category: 'Education'
  },
  {
    id: 'nuesara',
    name: 'Nuesara',
    description: 'A modern space with a great aesthetic, perfect for creative minds and good food.',
    latitude: -6.885, 
    longitude: 107.612, 
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    category: 'Restaurant'
  }
];

export const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  let successCount = 0;
  for (const place of PLACES_TO_SEED) {
    const success = await addOrUpdatePlace(place);
    if (success) {
      console.log(`✅ Successfully seeded: ${place.name}`);
      successCount++;
    } else {
      console.log(`❌ Failed to seed: ${place.name}`);
    }
  }
  
  console.log(`Seeding completed. Successfully added ${successCount}/${PLACES_TO_SEED.length} places.`);
};
