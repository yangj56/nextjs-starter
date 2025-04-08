"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

// Types
type ConnectionMode = "local" | "web";

type ApiConfig = {
  mode: ConnectionMode;
  localUrl: string;
  webUrl: string;
  embossingSpeed?: number;
  embossingDuration?: number;
  embossingDepth?: number;
  acceleration?: number;
  jerk?: number;
  coolingTime?: number;
};

interface SettingsContextType {
  // Authentication state
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;

  // API configuration
  apiConfig: ApiConfig;
  updateApiConfig: (config: Partial<ApiConfig>) => void;

  // Current API URL based on mode
  getCurrentApiUrl: () => string;
}

// Define the admin password directly in the code
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

// Default configuration - using the values from the original Kiosk component
const DEFAULT_CONFIG: ApiConfig = {
  mode: "local",
  localUrl: "http://localhost:5000/api/emboss",
  webUrl: "https://embossing-api.onrender.com/api/emboss",
  embossingSpeed: 50,
  embossingDuration: 200,
  embossingDepth: 5,
  acceleration: 1000,
  jerk: 8,
  coolingTime: 0,
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  // Load saved settings from localStorage on initial render
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(DEFAULT_CONFIG);

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    try {
      // Use the same localStorage key as the original Kiosk component
      const savedConfig = localStorage.getItem("embossingApiConfig");
      if (savedConfig) {
        setApiConfig(JSON.parse(savedConfig));
      }

      // Check for authentication state
      const savedAuth = localStorage.getItem("embossingAuthState");
      if (savedAuth) {
        setIsAuthenticated(JSON.parse(savedAuth));
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("embossingApiConfig", JSON.stringify(apiConfig));
      localStorage.setItem("embossingAuthState", JSON.stringify(isAuthenticated));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [apiConfig, isAuthenticated]);

  // Authentication functions
  const authenticate = (password: string): boolean => {
    const isValid = password === ADMIN_PASSWORD;
    if (isValid) {
      setIsAuthenticated(true);
    }
    return isValid;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // API configuration functions
  const updateApiConfig = (config: Partial<ApiConfig>) => {
    setApiConfig((prev) => ({
      ...prev,
      ...config,
    }));
  };

  // Helper to get the current API URL based on mode
  const getCurrentApiUrl = () => {
    return apiConfig.mode === "local" ? apiConfig.localUrl : apiConfig.webUrl;
  };

  // Create the context value
  const contextValue: SettingsContextType = {
    isAuthenticated,
    authenticate,
    logout,
    apiConfig,
    updateApiConfig,
    getCurrentApiUrl,
  };

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

// Custom hooks to use the context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export function useApiUrl() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useApiUrl must be used within a SettingsProvider");
  }
  return context.getCurrentApiUrl();
}

export function useIsAdmin() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useIsAdmin must be used within a SettingsProvider");
  }
  return context.isAuthenticated;
}
