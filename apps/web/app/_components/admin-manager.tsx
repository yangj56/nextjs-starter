"use client";

import React, { useState } from "react";
import { Settings, X } from "lucide-react";
import { useSettings } from "../context/settings";
import { FullscreenControls } from "./full-screen-controller";
import { Button } from "./shadcn/button";

export function AdminManager() {
  const { isAuthenticated, authenticate, logout, apiConfig, updateApiConfig } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = authenticate(password);
    if (!success) {
      setError("Invalid password");
    }
  };

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URLs
    if (apiConfig.mode === "local" && !apiConfig.localUrl) {
      setError("Local URL is required");
      return;
    }

    if (apiConfig.mode === "web" && !apiConfig.webUrl) {
      setError("Web URL is required");
      return;
    }

    try {
      // The context will handle saving to localStorage
      setSuccessMessage("Configuration saved successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (e) {
      setError("Failed to save configuration");
      console.error("Config save error:", e);
    }
  };

  const handleLogout = () => {
    logout();
    setPassword("");
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <Button
        onClick={() => setShowSettings(true)}
        variant="ghost"
        size="icon"
        aria-label="Settings"
      >
        <Settings size={24} />
      </Button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="my-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white pb-2">
              <h2 className="text-xl font-bold">Admin Configuration</h2>
              <Button
                onClick={() => setShowSettings(false)}
                variant="ghost"
                size="icon"
                aria-label="Close"
              >
                <X size={24} />
              </Button>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full">
                  Authenticate
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleConfigSave} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">API Mode</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="apiMode"
                          value="local"
                          checked={apiConfig.mode === "local"}
                          onChange={() => updateApiConfig({ mode: "local" })}
                          className="mr-2"
                        />
                        Local URL
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="apiMode"
                          value="web"
                          checked={apiConfig.mode === "web"}
                          onChange={() => updateApiConfig({ mode: "web" })}
                          className="mr-2"
                        />
                        Web URL
                      </label>
                    </div>
                  </div>

                  {apiConfig.mode === "local" ? (
                    <div>
                      <label
                        htmlFor="localUrl"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Local API URL
                      </label>
                      <input
                        type="url"
                        id="localUrl"
                        value={apiConfig.localUrl}
                        onChange={(e) => updateApiConfig({ localUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="http://localhost:5000/api/emboss"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use this for connecting to a Raspberry Pi on your local network
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="webUrl"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Web API URL
                      </label>
                      <input
                        type="url"
                        id="webUrl"
                        value={apiConfig.webUrl}
                        onChange={(e) => updateApiConfig({ webUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://your-api-endpoint.com/api/emboss"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use this for connecting to a remote API endpoint
                      </p>
                    </div>
                  )}

                  {/* Embossing Speed Configuration */}
                  <div>
                    <label
                      htmlFor="embossingSpeed"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Speed (mm/s)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingSpeed"
                        min="1"
                        max="100"
                        value={apiConfig.embossingSpeed || 50}
                        onChange={(e) =>
                          updateApiConfig({
                            embossingSpeed: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingSpeed || 50}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how fast the embossing head moves. Lower values create more precise
                      results.
                    </p>
                  </div>

                  {/* Embossing Duration Configuration */}
                  <div>
                    <label
                      htmlFor="embossingDuration"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Duration (ms)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingDuration"
                        min="50"
                        max="500"
                        step="10"
                        value={apiConfig.embossingDuration || 200}
                        onChange={(e) =>
                          updateApiConfig({
                            embossingDuration: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingDuration || 200}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how long the embossing head stays at each point. Higher values create
                      deeper impressions.
                    </p>
                  </div>

                  {/* Embossing Depth Configuration */}
                  <div>
                    <label
                      htmlFor="embossingDepth"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Embossing Depth (1-10)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="embossingDepth"
                        min="1"
                        max="10"
                        value={apiConfig.embossingDepth || 5}
                        onChange={(e) =>
                          updateApiConfig({
                            embossingDepth: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-center">{apiConfig.embossingDepth || 5}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Controls how deep the embossing head presses into the material.
                    </p>
                  </div>

                  {/* Advanced Settings Toggle */}
                  <div>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      className="h-auto p-0"
                    >
                      {showAdvancedSettings ? "Hide Advanced Settings" : "Show Advanced Settings"}
                    </Button>
                  </div>

                  {/* Advanced Settings */}
                  {showAdvancedSettings && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-3 text-sm font-medium text-gray-700">Advanced Settings</h3>

                      {/* Acceleration Setting */}
                      <div className="mb-3">
                        <label
                          htmlFor="acceleration"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Acceleration (mm/s²)
                        </label>
                        <input
                          type="number"
                          id="acceleration"
                          min="100"
                          max="3000"
                          value={apiConfig.acceleration || 1000}
                          onChange={(e) =>
                            updateApiConfig({
                              acceleration: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </div>

                      {/* Jerk Setting */}
                      <div className="mb-3">
                        <label
                          htmlFor="jerk"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Jerk (mm/s)
                        </label>
                        <input
                          type="number"
                          id="jerk"
                          min="1"
                          max="20"
                          value={apiConfig.jerk || 8}
                          onChange={(e) =>
                            updateApiConfig({
                              jerk: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </div>

                      {/* Cooling Time */}
                      <div>
                        <label
                          htmlFor="coolingTime"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Cooling Time (s)
                        </label>
                        <input
                          type="number"
                          id="coolingTime"
                          min="0"
                          max="60"
                          step="5"
                          value={apiConfig.coolingTime || 0}
                          onChange={(e) =>
                            updateApiConfig({
                              coolingTime: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Time to wait between embossing operations to prevent overheating (0 to
                          disable)
                        </p>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Save Configuration
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </form>

                {/* Add fullscreen controls if authenticated */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700">Display Settings</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Fullscreen Mode</span>
                    <FullscreenControls />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
