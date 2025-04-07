'use client';

import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-800 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </Button>
            <span className="text-lg font-medium text-white">Back to Search</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">How to Use Search</h1>

          <div className="space-y-12">
            {/* Section 1: Getting Started */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Getting Started</h2>
              <p className="text-gray-300">
                Search is powered by Google's Gemini AI, providing intelligent search results with sources.
                To use Search, you'll need a Gemini API key.
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-medium text-white">Obtaining a Gemini API Key</h3>
                <ol className="list-decimal text-gray-300 pl-5 space-y-3">
                  <li>
                    Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink className="h-3 w-3" /></a>
                  </li>
                  <li>Sign in with your Google account</li>
                  <li>Navigate to the "Get API key" section</li>
                  <li>Create a new API key or use an existing one</li>
                  <li>Copy your API key (it should start with "AIza...")</li>
                </ol>
              </div>
            </section>

            {/* Section 2: Setting Up Search */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Setting Up Search</h2>
              <p className="text-gray-300">
                Once you have your Gemini API key, you need to configure Search to use it:
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <ol className="list-decimal text-gray-300 pl-5 space-y-3">
                  <li>Click the settings icon (⚙️) in the top-right corner of the Search homepage</li>
                  <li>In the settings dialog, paste your Gemini API key</li>
                  <li>Click "Save Settings"</li>
                  <li>Your API key will be stored securely in your browser's local storage</li>
                </ol>
              </div>
            </section>

            {/* Section 3: Using Search */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Using Search</h2>
              <p className="text-gray-300">
                Now that you've set up your API key, you can start using Search:
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <ol className="list-decimal text-gray-300 pl-5 space-y-3">
                  <li>Type your question or search query in the search box</li>
                  <li>Press Enter or click the search icon</li>
                  <li>Search will use Gemini AI to find relevant information and provide a response</li>
                  <li>You'll see sources listed below the response, which you can click to view the original content</li>
                  <li>You can ask follow-up questions in the provided input field</li>
                </ol>
              </div>
            </section>

            {/* Section 4: Tips for Better Results */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Tips for Better Results</h2>
              <p className="text-gray-300">
                To get the most out of Search, follow these tips:
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <ul className="list-disc text-gray-300 pl-5 space-y-3">
                  <li>Be specific in your questions</li>
                  <li>Use natural language rather than keyword-style searches</li>
                  <li>For complex topics, break down your questions into simpler parts</li>
                  <li>Use follow-up questions to drill down into specific aspects of a topic</li>
                  <li>Check the sources to verify information and learn more</li>
                </ul>
              </div>
            </section>
            
            {/* Section 5: Privacy & Data */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Privacy & Data</h2>
              <p className="text-gray-300">
                Search is designed with privacy in mind:
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-3">
                <ul className="list-disc text-gray-300 pl-5 space-y-3">
                  <li>Your API key is stored only in your browser's local storage</li>
                  <li>Search does not track your search history beyond the current session</li>
                  <li>Your search queries are sent directly to the Gemini API</li>
                  <li>No personal data is collected or stored on any server</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  For more information about privacy, see our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 All Rights Reserved. Festus Kahunla
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-primary text-sm">
                Privacy Policy
              </Link>
              <Link href="/" className="text-gray-400 hover:text-primary text-sm">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
