// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [oauthToken, updateOauthToken] = useState({ textContent: "" });
  
  const [signInStatus, updateSignInStatus] = useState({ textContent: "Sign in" });
  
  const [accountDetails, updateAccountDetails] = useState({ textContent: "" });

  const firebaseConfig = {
        apiKey: import.meta.env.VITE_apiKey,
        authDomain: import.meta.env.VITE_authDomain,
        projectId: import.meta.env.VITE_projectId,
        storageBucket: import.meta.env.VITE_storageBucket,
        messagingSenderId: import.meta.env.VITE_messagingSenderId,
        appId: import.meta.env.VITE_appId,
        measurementId: import.meta.env.VITE_measurementId
      };

  const app = initializeApp(firebaseConfig);
   const auth = getAuth();
  
    const analytics = getAnalytics(app);

    

      

  const login = (userData) => {
    setUser(userData);
    // optionally persist token in localStorage
    
  };

  const logout = () => {
    setUser(null);
    // clear storage, invalidate token, etc.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// handy hook so you don’t repeat `useContext`
export function useAuth() {
  return useContext(AuthContext);
}
