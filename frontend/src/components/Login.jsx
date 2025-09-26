import React from "react";
import "./Styles/Login.css";

// Needs to be moved to the root 
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { useState } from 'react'


import {
  GoogleAuthProvider,
  GithubAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';


const Login = () => {
  // console.log(import.meta.env)
  // console.log(import.meta.env.apiKey)
  // Make environment files
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
  };


  const [oauthToken, updateOauthToken] = useState({ textContent: "" });

  const [signInStatus, updateSignInStatus] = useState({ textContent: "Sign in" });

  const [accountDetails, updateAccountDetails] = useState({ textContent: "" });
  const [signInButton, updateSignInButton] = useState({ textContent: "Sign in with GitHub" });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const analytics = getAnalytics(app);

  function toggleSignIn(method) {

    // Check if the user is authenticated 
    if (!auth.currentUser) {
      console.log("Log In method called")
      const provider = new GithubAuthProvider();
      provider.addScope('repo');
      signInWithPopup(auth, provider)
        .then(function (result) {
          const credential = GithubAuthProvider.credentialFromResult(result);
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          updateOauthToken({ textContent: token ?? '' });
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert(
              'You have already signed up with a different auth provider for that email.',
            );
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error);
          }
        });
    } else {
      signOut(auth);
    }
    updateSignInButton({ ...signInButton, disabled: true });
  }


  // Listening for auth state changes.
  onAuthStateChanged(auth, function (user) {
    if (user) {
      // User is signed in.
      const displayName = user.displayName;
      const email = user.email;
      const emailVerified = user.emailVerified;
      const photoURL = user.photoURL;
      const isAnonymous = user.isAnonymous;
      const uid = user.uid;
      const providerData = user.providerData;
      updateSignInStatus({ textContent: 'Signed in' });
      updateSignInButton({ textContent: 'Sign out' });
      updateAccountDetails({ textContent: JSON.stringify(user, null, '  ') });
    } else {
      // User is signed out.
      updateSignInStatus({ textContent: 'Signed out' });
      updateSignInButton({ textContent: 'Sign in with GitHub' });
      updateAccountDetails({ textContent: 'null' });
      updateOauthToken({ textContent: 'null' });
    }
    signInButton.disabled = false;
  });


  return (
    <div className="login-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="login-form">
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email or Phone" id="email" />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <button onClick={()=> toggleSignIn("Email")} type="submit">Log In</button>

        <div className="social">
          <div className="google" onClick={() =>{toggleSignIn("Google")}}>Google</div>
          <div className="github" onClick={() =>{toggleSignIn("Github")}}>GitHub</div>
        </div>
      </form>
    </div>
  );
};

export default Login;
