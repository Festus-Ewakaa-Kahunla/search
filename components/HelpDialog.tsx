import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function HelpDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-14 z-50">
          <HelpCircle className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Learn how to use Search and get the most out of it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">How to use Search</h3>
              <p className="text-sm text-gray-400">
                Type your question in the search box and press Enter. Search will use Google's Gemini AI
                to find relevant information and provide a helpful answer.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Setting up your API Key</h3>
              <p className="text-sm text-gray-400">
                Search requires a Google Gemini API key to function. Click on the settings icon to add your API key.
              </p>
              <Link 
                href="/help" 
                className="text-primary hover:underline text-sm flex items-center gap-1 mt-2"
                onClick={() => setOpen(false)}
              >
                Detailed instructions <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Additional Resources</h3>
              <div className="space-y-2">
                <Link 
                  href="/help" 
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                  onClick={() => setOpen(false)}
                >
                  Full Help Guide <ExternalLink className="h-3 w-3" />
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                  onClick={() => setOpen(false)}
                >
                  Privacy Policy <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
