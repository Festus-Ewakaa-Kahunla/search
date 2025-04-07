import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import { Logo } from '@/components/Logo';

interface SearchResultsProps {
  query: string;
  results: any;
  isLoading: boolean;
  error?: Error;
  isFollowUp?: boolean;
  originalQuery?: string;
}

export function SearchResults({ 
  query,
  results,
  isLoading,
  error,
  isFollowUp,
  originalQuery
}: SearchResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  if (error) {
    // Check if it's an API key error
    const isApiKeyError = error.message?.includes('API key');
    
    if (isApiKeyError) {
      return (
        <Card className="p-6 animate-in fade-in-50 border-primary/30 bg-gradient-to-br from-black to-gray-900/80">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
              <Settings className="h-16 w-16 text-primary relative z-10" />
            </div>
            
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-semibold text-white">API Key Required</h3>
              <p className="text-gray-400">
                Please provide your Gemini API key in settings to use the search functionality.
                You'll need to get your own API key from Google AI Studio.
              </p>
            </div>
            
            <a href="/" className="inline-block">
              <Button 
                className="bg-primary hover:bg-primary/90 text-gray-900 font-medium"
              >
                Return to Home
              </Button>
            </a>
          </div>
        </Card>
      );
    }
    
    // Standard error display for other errors
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while searching. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in-50">
        <div className="flex justify-center mb-8">
          <Logo animate className="w-12 h-12" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
        <div className="space-y-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div ref={contentRef} className="space-y-6 animate-in fade-in-50">
      {/* Original query reference - only shown for follow-up questions */}
      {isFollowUp && originalQuery && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 mb-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs sm:text-sm text-muted-foreground/70">
            <span>Original search:</span>
            <span className="font-medium">"{originalQuery}"</span>
          </div>
          <div className="h-px bg-border w-full" />
        </motion.div>
      )}

      {/* Sources Section */}
      {results.sources && results.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SourceList sources={results.sources} />
        </motion.div>
      )}

      {/* Main Content */}
      <Card className="overflow-hidden shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="py-4 px-8"
        >
          <div
            className={cn(
              "prose prose-slate max-w-none text-white font-inter",
              "prose-headings:font-semibold prose-headings:mb-4 prose-headings:text-white prose-headings:tracking-tight",
              "prose-h2:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-h2:border-border prose-h2:text-white",
              "prose-h3:text-xl prose-h3:mt-6 prose-h3:text-white",
              "prose-p:text-base prose-p:leading-7 prose-p:my-4 prose-p:text-white",
              "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
              "prose-li:my-2 prose-li:text-white prose-li:marker:text-primary",
              "prose-strong:font-semibold prose-strong:text-white",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80",
              "tracking-tight"
            )}
            dangerouslySetInnerHTML={{ 
              __html: results.summary
            }}
          />
        </motion.div>
      </Card>
    </div>
  );
}