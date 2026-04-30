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
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  imageUrl: string;
  category: string;
}

const PLACES_COLLECTION = 'places';

// Get all places (One-time fetch)
export const getPlaces = async (): Promise<Place[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PLACES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
  } catch (error) {
    console.error("Error fetching places: ", error);
    return [];
  }
};

// Listen to places (Real-time updates)
export const subscribeToPlaces = (callback: (places: Place[]) => void) => {
  const q = query(collection(db, PLACES_COLLECTION));
  
  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const places = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
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
