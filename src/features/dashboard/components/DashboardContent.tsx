import { useState, useEffect } from 'react';
import { 
  Link2, 
  Sparkles, 
  FileAudio, 
  Download, 
  Copy, 
  Volume2, 
  Loader2,
  CheckCircle2,
  Play,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../../App';
import { createSummary } from '../../../lib/summaries';
import { ChatInterface } from './ChatInterface';

interface DashboardContentProps {
  selectedSummaryId: string | null;
  onShowExport: () => void;
  onSummaryCreated: (summaryId: string) => void;
}

export function DashboardContent({ selectedSummaryId, onShowExport, onSummaryCreated }: DashboardContentProps) {
  const { user, summaries, refreshSummaries } = useApp();
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const selectedSummary = summaries.find((s) => s.id === selectedSummaryId);

  useEffect(() => {
    if (!selectedSummaryId) {
      setUrl('');
    }
  }, [selectedSummaryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !user) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Determine type based on URL
      let type: 'youtube' | 'audio' | 'url' = 'url';
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        type = 'youtube';
      } else if (url.match(/\.(mp3|wav|m4a|ogg)$/i)) {
        type = 'audio';
      }

      // Generate mock summary
      const title = type === 'youtube' 
        ? 'Understanding AI in 2026' 
        : type === 'audio'
        ? 'Audio Transcript Summary'
        : 'Article Summary';
      
      const summaryText = `This ${type === 'youtube' ? 'video' : type === 'audio' ? 'audio file' : 'article'} discusses the latest developments in artificial intelligence and machine learning. Key points include:\n\n• The rapid advancement of AI technology in recent years\n• How AI is transforming various industries including healthcare, finance, and education\n• The importance of ethical considerations in AI development\n• Future predictions for AI capabilities and applications\n\nThe content emphasizes the need for responsible AI development while highlighting the tremendous potential for positive impact across multiple sectors. It also addresses common concerns about AI safety and the importance of human oversight in AI systems.`;

      // Save to Supabase
      const newSummary = await createSummary(user.id, url, title, summaryText, type);
      
      // Refresh summaries list
      await refreshSummaries();
      
      setUrl('');
      onSummaryCreated(newSummary.id);
    } catch (error) {
      console.error('Error creating summary:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!selectedSummary) return;

    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = selectedSummary.summary;
      
      // Make it invisible and positioned off-screen
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Try to copy using execCommand
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleTextToSpeech = () => {
    // Mock text-to-speech functionality
    alert('Text-to-speech conversion started! This would generate an audio file of the summary.');
  };

  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden">
      {!selectedSummary ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold mb-2">What would you like to summarize?</h1>
              <p className="text-muted-foreground">
                Paste a YouTube URL, upload an audio file, or share any web link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-12 pr-4 py-4 bg-secondary/20 border border-border rounded-2xl outline-none focus:border-primary transition-colors text-base"
                  disabled={isProcessing}
                />
              </div>

              <button
                type="submit"
                disabled={!url.trim() || isProcessing}
                className="w-full bg-primary text-white px-6 py-4 rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </form>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">YouTube</h3>
                <p className="text-sm text-muted-foreground">Summarize videos</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileAudio className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Audio</h3>
                <p className="text-sm text-muted-foreground">Convert to text</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Web Links</h3>
                <p className="text-sm text-muted-foreground">Extract insights</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold mb-2">{selectedSummary.title}</h1>
                <a
                  href={selectedSummary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Link2 className="w-4 h-4" />
                  {selectedSummary.url}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleTextToSpeech}
                  className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                  title="Convert to audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-2"
                  title="Chat with AI"
                >
                  <MessageSquare className="w-5 h-5" />
                  Ask AI
                </button>
                <button
                  onClick={onShowExport}
                  className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-generated summary</span>
                </div>

                <div className="prose prose-gray max-w-none">
                  {selectedSummary.summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Generated on {new Date(selectedSummary.created_at).toLocaleDateString()}</span>
                    <span className="capitalize">{selectedSummary.type} content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showChat && selectedSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[600px] relative">
            <button
              onClick={() => setShowChat(false)}
              className="absolute -top-12 right-0 text-white hover:text-white/80 transition-colors"
            >
              ✕ Close
            </button>
            <ChatInterface
              summaryText={selectedSummary.summary}
              summaryTitle={selectedSummary.title}
            />
          </div>
        </div>
      )}
    </main>
  );
}