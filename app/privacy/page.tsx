'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <p>
                This Privacy Policy explains how Search handles your information
                when you use our application. We are committed to protecting your privacy and ensuring
                the security of any personal information you provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Don't Collect</h2>
              <p className="mb-4">
                We believe in minimizing data collection. Our application is designed to operate without
                storing or processing any personal data on our servers. Specifically:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not store your search queries on our servers</li>
                <li>We do not collect your personal information</li>
                <li>We do not track your activity across the web</li>
                <li>We do not use cookies to track you</li>
                <li>We do not sell or share any data with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your API Key</h2>
              <p className="mb-4">
                To use Search, you need to provide a Google Gemini API key. Here's how we handle your API key:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your API key is stored only in your browser's local storage</li>
                <li>Your API key never leaves your device except when making direct API calls to Google</li>
                <li>We do not have access to your API key</li>
                <li>You can remove your API key at any time through the settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Local Storage</h2>
              <p className="mb-4">
                We use your browser's local storage for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To store your API key for convenience between sessions</li>
                <li>To temporarily maintain conversation history during your session</li>
              </ul>
              <p>
                All local storage data remains solely on your device and is not transmitted to or accessible by us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <p className="mb-4">
                Our application interacts with the following third-party services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Google Gemini AI:</strong> Your queries are sent to Google's Gemini AI API using your
                  provided API key. Please refer to Google's Privacy Policy to understand how they
                  handle this data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p>
                While we don't collect your personal data on our servers, we've implemented appropriate
                technical measures to ensure the application operates securely. However, no method of
                transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
                periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact Festus Kahunla at <a href="mailto:festus@kahunla.com" className="text-primary hover:underline">festus@kahunla.com</a>.
              </p>
            </section>
            
            <div className="border-t border-gray-700 pt-6 mt-8">
              <p className="text-gray-400 text-sm">
                Last updated: April 7, 2025
              </p>
            </div>
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
              <Link href="/help" className="text-gray-400 hover:text-primary text-sm">
                Help Guide
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
