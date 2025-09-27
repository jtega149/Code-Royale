// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user state
  const [oauthToken, setOauthToken] = useState(null);
  const [signInStatus, setSignInStatus] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);

  // login + logout handlers
  const login = (userData) => {
    setUser(userData);
    setSignInStatus(true);
  };

  const logout = () => {
    setUser(null);
    setOauthToken(null);
    setSignInStatus(false);
    setAccountDetails(null);
  };

  // helper updaters
  const updateAccountDetails = (details) => {
    setAccountDetails(details);
  };

  const updateSignInStatus = (status) => {
    setSignInStatus(status);
  };

  const updateOauthToken = (token) => {
    setOauthToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        oauthToken,
        signInStatus,
        accountDetails,
        updateAccountDetails,
        updateSignInStatus,
        updateOauthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
