// lib/env.ts
// In Next.js we don't need to manually load .env files as Next.js does this automatically
// This is just a helper to provide environment variables in a structured way

export function setupEnvironment() {
  return {
    // For Next.js, we're getting API key from settings dialog instead of .env file
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}
