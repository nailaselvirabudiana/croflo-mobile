export const MOCK_USER = {
  id: '1',
  name: 'Alex',
  fullName: 'Alex Rivers',
  email: 'alex.rivers@crowdwatch.com',
  visits: 42,
  savedPlaces: 12,
};

export const CURRENT_SPOT = {
  id: 'c1',
  name: 'Coworking Space',
  occupancy: 84,
  status: 'Busy',
  updatedAt: 'Updated 2m ago',
  message: 'Peak density reached'
};

export const RECOMMENDED_PLACES = [
  {
    id: 'p1',
    name: 'Jabarano Coffee',
    category: 'Coffee & Workspace',
    rating: 4.8,
    distance: '0.8 km',
    occupancy: 42,
    status: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'p2',
    name: 'Bagi Kopi',
    category: 'Local Roastery',
    rating: 4.5,
    distance: '1.2 km',
    occupancy: 91,
    status: 'Busy',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300&auto=format&fit=crop',
  }
];

export const PLACE_DETAILS = {
  id: 'p1',
  name: 'Jabarano Coffee Dago',
  address: 'Jl. Ir. H. Juanda No. 10, Bandung',
  rating: 4.8,
  availableSeats: 12,
  totalSeats: 45,
  waitTime: '~8 Min',
  waitTrend: 'Decreasing shortly',
  forecast: [
    { time: '08:00', value: 30 },
    { time: '10:00', value: 45 },
    { time: '12:00', value: 80 },
    { time: '13:00', value: 95 },
    { time: '14:00', value: 100 },
    { time: '16:00', value: 70 },
    { time: '18:00', value: 40 },
    { time: '20:00', value: 20 },
  ]
};

export const NEARBY_DESTINATIONS = [
  {
    id: 'd1',
    name: 'Bandung Zoo',
    category: 'Lebak Siliwangi',
    rating: 4.5,
    distance: '1.2 km away',
    status: 'MODERATE',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'd2',
    name: 'Museum Asia Afrika',
    category: 'Braga St.',
    rating: 4.8,
    distance: '2.8 km away',
    status: 'LOW',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'd3',
    name: 'Wheels Riau',
    category: 'Riau St.',
    rating: 4.6,
    distance: '3.1 km away',
    status: 'BUSY',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&auto=format&fit=crop',
  }
];

export const MAP_MARKERS = [
  {
    id: 'm1',
    coordinate: { latitude: -6.886, longitude: 107.615 },
    name: 'Jabarano Coffee',
    type: 'cafe',
  },
  {
    id: 'm2',
    coordinate: { latitude: -6.921, longitude: 107.610 },
    name: 'Museum Asia Afrika',
    type: 'museum',
    status: 'LOW CROWD',
    distance: '120m away',
    capacity: 15,
    waitTime: '5 min',
    trend: 'Declining'
  },
  {
    id: 'm3',
    coordinate: { latitude: -6.905, longitude: 107.625 },
    name: 'Wheels',
    type: 'restaurant',
  }
];

export const RECENT_ACTIVITY: any[] = [];
