import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Settings, Info, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog() {
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // We no longer auto-open settings, users will click the settings button when they need it

  // Load API key from localStorage when component mounts
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey') || '';
    setApiKey(savedApiKey);
  }, []);

  // Handle saving the API key
  const handleSaveApiKey = () => {
    // Basic validation for Gemini API key format (starts with "AIza")
    if (apiKey && !apiKey.startsWith('AIza')) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: 'Invalid API key format. Gemini API keys typically start with "AIza"'
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('geminiApiKey', apiKey);
    toast({
      title: "Settings Saved",
      description: apiKey ? 'API key saved successfully' : 'Default API key will be used'
    });
    setOpen(false);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('geminiApiKey');
    toast({
      title: "API Key Removed",
      description: 'The application will use the default API key.'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50">
          <Settings className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border border-gray-800">
        {!apiKey && (
          <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">API Key Required</AlertTitle>
            <AlertDescription className="text-amber-200/90">
              You need to provide your own Gemini API key to use this search application.
            </AlertDescription>
          </Alert>
        )}
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Application Settings
          </DialogTitle>
          <DialogDescription>
            Configure your personal settings for the Search application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white">Gemini API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key (starts with AIza...)"
              className="bg-background border-gray-700 text-white"
              type="password"
            />
            <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary/70" />
              <p>
                This search application is powered by Google's Gemini AI. You need to provide your own API key.
                <a 
                  href="https://ai.google.dev/tutorials/setup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Get your API key from Google AI Studio
                </a>
                .
              </p>
            </div>
            <div className="text-xs text-gray-400 pl-6">
              Without an API key, you won't be able to use the search functionality.
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleClearApiKey}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Clear Key
          </Button>
          <Button 
            onClick={handleSaveApiKey} 
            className="bg-primary hover:bg-primary/90 text-gray-900 font-medium"
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
