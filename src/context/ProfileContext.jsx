import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME } from '../themes';

const ProfileContext = createContext(null);

const GUEST_PROFILE_KEY = 'pet-disaster-guest-profile';

const defaultProfile = {
  petType: null,
  petName: '',
  ageGroup: DEFAULT_THEME,
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useState(defaultProfile);

  useEffect(() => {
    if (user === undefined) return;

    if (user === null) {
      const saved = localStorage.getItem(GUEST_PROFILE_KEY);
      if (saved) setProfileState(JSON.parse(saved));
      return;
    }

    const ref = doc(db, 'users', user.uid, 'profile', 'main');
    getDoc(ref).then((snap) => {
      if (snap.exists()) setProfileState(snap.data());
    });
  }, [user]);

  const saveProfile = async (data) => {
    const next = { ...profile, ...data };
    setProfileState(next);

    if (user) {
      const ref = doc(db, 'users', user.uid, 'profile', 'main');
      await setDoc(ref, next, { merge: true });
    } else {
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(next));
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
