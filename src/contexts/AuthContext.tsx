import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback timeout: if Firebase takes longer than 3 seconds to respond, force loading to false
    // This prevents the infinite spinner bug that happens sometimes with async-storage
    const timeout = setTimeout(() => {
      console.warn("Firebase onAuthStateChanged is taking too long. Forcing app to load.");
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeout); // Clear the timeout if Firebase responds
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription and timeout on unmount
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
