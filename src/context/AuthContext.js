"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  signInWithOAuth,
  updateUserPrefs,
  sendPasswordRecovery,
  OAuthProvider,
} from "@/lib/appwrite-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkedRef = useRef(false);

  // Check for existing session on mount (only once)
  useEffect(() => {
    if (!checkedRef.current) {
      checkedRef.current = true;
      checkUser();
    }
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Ensure profile exists for the user
      if (currentUser) {
        ensureProfileExists(currentUser);
      }
    } catch (error) {
      // Silently handle - user not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Helper to ensure profile document exists
  async function ensureProfileExists(currentUser) {
    try {
      const response = await fetch(`/api/profile?userId=${currentUser.$id}`);
      if (response.status === 404) {
        // Profile doesn't exist, create it
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.$id,
            name: currentUser.name || "User",
            email: currentUser.email,
            userType: currentUser.prefs?.userType || "jobseeker",
            isPublic: true,
            isPremium: false,
          }),
        });
        console.log("Profile created for existing user");
      }
    } catch (error) {
      console.error("Error ensuring profile exists:", error);
    }
  }

  async function login(email, password) {
    try {
      await signIn(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to sign in",
      };
    }
  }

  async function register(email, password, name, userType = "jobseeker") {
    try {
      await signUp(email, password, name);
      // Set user type in preferences
      await updateUserPrefs({ userType });
      const currentUser = await getCurrentUser();

      // Create profile document in the database
      if (currentUser) {
        try {
          await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.$id,
              name: name,
              email: email,
              userType: userType,
              isPublic: true,
              isPremium: false,
            }),
          });
        } catch (profileError) {
          console.error("Failed to create profile:", profileError);
          // Don't fail registration if profile creation fails
        }
      }

      setUser(currentUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }
  }

  async function logout() {
    try {
      await signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
  }

  function loginWithGoogle() {
    signInWithOAuth(OAuthProvider.Google);
  }

  function loginWithLinkedIn() {
    signInWithOAuth(OAuthProvider.Linkedin);
  }

  async function forgotPassword(email) {
    try {
      await sendPasswordRecovery(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to send recovery email",
      };
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithLinkedIn,
    forgotPassword,
    checkUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
