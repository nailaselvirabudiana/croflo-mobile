import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  query,
  QuerySnapshot,
  DocumentData,
  setDoc,
  deleteDoc,
  where,
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

export interface SavedPlace {
  placeId: string;
  name: string;
  category: string;
  rating: number;
  image?: string;
  address?: string;
  savedAt: number; // timestamp ms
}

const PLACES_COLLECTION = 'places';
const SAVED_PLACES_COLLECTION = 'savedPlaces';

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
  let latitude = 0;
  let longitude = 0;

  const coords = data.coordinates;
  if (coords) {
    if (typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
      // Firestore GeoPoint: { latitude: -6.904, longitude: 107.616 }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else if (coords[0] && coords[1]) {
      // String array: ["6.904° S", "107.616° E"]
      latitude = parseCoordinate(String(coords[0]));
      longitude = parseCoordinate(String(coords[1]));
    }
  }

  // Fallback: top-level numeric latitude/longitude fields
  if (latitude === 0 && longitude === 0) {
    if (typeof data.latitude === 'number') latitude = data.latitude;
    if (typeof data.longitude === 'number') longitude = data.longitude;
  }

  return {
    id: docId,
    name: data.name || '',
    description: data.description || '',
    coordinates: coords || [],
    latitude,
    longitude,
    rating: data.rating || 0,
    image: data.image || data.imageUrl || '',
    imageUrl: data.image || data.imageUrl || '',
    category: data.category || '',
    occupancy: data.occupancy !== undefined ? data.occupancy : Math.floor(Math.random() * 100),
    distance: data.distance || '0.8 km',
    address: data.address || '',
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

// ─── Saved Places ────────────────────────────────────────────────────────────

/** Save a place for a user. docId = `<userId>_<placeId>` for easy lookup. */
export const savePlace = async (userId: string, place: Place): Promise<boolean> => {
  try {
    const docId = `${userId}_${place.id}`;
    const ref = doc(db, SAVED_PLACES_COLLECTION, docId);
    const savedPlace: SavedPlace = {
      placeId: place.id,
      name: place.name,
      category: place.category,
      rating: place.rating,
      image: place.image || place.imageUrl || '',
      address: place.address || '',
      savedAt: Date.now(),
    };
    await setDoc(ref, { userId, ...savedPlace });
    return true;
  } catch (error) {
    console.error("Error saving place: ", error);
    return false;
  }
};

/** Unsave (delete) a saved place for a user. */
export const unsavePlace = async (userId: string, placeId: string): Promise<boolean> => {
  try {
    const docId = `${userId}_${placeId}`;
    await deleteDoc(doc(db, SAVED_PLACES_COLLECTION, docId));
    return true;
  } catch (error) {
    console.error("Error unsaving place: ", error);
    return false;
  }
};

/** Check if a specific place is saved by a user. */
export const isPlaceSaved = async (userId: string, placeId: string): Promise<boolean> => {
  try {
    const docId = `${userId}_${placeId}`;
    const snap = await getDoc(doc(db, SAVED_PLACES_COLLECTION, docId));
    return snap.exists();
  } catch {
    return false;
  }
};

/** One-time fetch of all saved places for a user. */
export const getSavedPlaces = async (userId: string): Promise<SavedPlace[]> => {
  try {
    const q = query(
      collection(db, SAVED_PLACES_COLLECTION),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as SavedPlace);
  } catch (error) {
    console.error("Error fetching saved places: ", error);
    return [];
  }
};

/** Real-time subscription to saved places for a user. */
export const subscribeToSavedPlaces = (
  userId: string,
  callback: (places: SavedPlace[]) => void
) => {
  const q = query(
    collection(db, SAVED_PLACES_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const places = snap.docs.map(d => d.data() as SavedPlace);
    callback(places);
  }, (error) => {
    console.error("Error subscribing to saved places: ", error);
  });
};

export interface UserStats {
  visits: number;
  savedPlaces?: number;
}

const USERS_COLLECTION = 'users';

/** Real-time subscription to user statistics (visits, etc.) */
export const subscribeToUserStats = (
  userId: string,
  callback: (stats: UserStats) => void
) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserStats);
    } else {
      // Fallback if user doc doesn't exist yet
      callback({ visits: 0 });
    }
  }, (error) => {
    console.error("Error subscribing to user stats: ", error);
  });
};
