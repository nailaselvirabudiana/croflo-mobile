import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot,
  query,
  QuerySnapshot,
  DocumentData,
  setDoc
} from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

export interface Place {
  id: string;
  name: string;
  description?: string;
  coordinates?: string[]; // Firestore stores as ["6.904° S", "107.616° E"]
  latitude: number;
  longitude: number;
  rating: number;
  image?: string; // Firestore uses 'image'
  imageUrl?: string; // For compatibility
  category: string;
  occupancy?: number;
  distance?: string;
  forecast?: any[]; // For details
  address?: string;
  availableSeats?: number;
  totalSeats?: number;
  waitTime?: string;
  waitTrend?: string;
}

const PLACES_COLLECTION = 'places';

// Helper to parse coordinates like "6.904° S" or "107.616° E"
const parseCoordinate = (coordStr: string): number => {
  if (!coordStr) return 0;
  const match = coordStr.match(/([\d.]+)/);
  if (!match) return 0;
  
  let val = parseFloat(match[1]);
  if (coordStr.includes('S') || coordStr.includes('W')) {
    val = -val;
  }
  return val;
};

// Map Firestore doc to Place interface
const mapDocToPlace = (docId: string, data: any): Place => {
  const latitude = data.coordinates ? parseCoordinate(data.coordinates[0]) : 0;
  const longitude = data.coordinates ? parseCoordinate(data.coordinates[1]) : 0;
  
  return {
    id: docId,
    name: data.name || '',
    description: data.description || '',
    coordinates: data.coordinates || [],
    latitude,
    longitude,
    rating: data.rating || 0,
    image: data.image || '',
    imageUrl: data.image || '', // Alias for compatibility
    category: data.category || '',
    occupancy: data.occupancy || Math.floor(Math.random() * 100), // Fallback for UI
    distance: data.distance || '0.8 km', // Fallback for UI
  };
};

// Get all places (One-time fetch)
export const getPlaces = async (): Promise<Place[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PLACES_COLLECTION));
    return querySnapshot.docs.map(doc => mapDocToPlace(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching places: ", error);
    return [];
  }
};

// Listen to places (Real-time updates)
export const subscribeToPlaces = (callback: (places: Place[]) => void) => {
  const q = query(collection(db, PLACES_COLLECTION));
  
  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const places = querySnapshot.docs.map(doc => mapDocToPlace(doc.id, doc.data()));
    callback(places);
  }, (error) => {
    console.error("Error listening to places: ", error);
  });

  return unsubscribe;
};

// Add or update a place (useful for seeding)
export const addOrUpdatePlace = async (place: Place) => {
  try {
    const placeRef = doc(db, PLACES_COLLECTION, place.id);
    await setDoc(placeRef, place);
    return true;
  } catch (error) {
    console.error("Error adding place: ", error);
    return false;
  }
};
