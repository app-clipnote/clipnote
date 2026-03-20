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
  MessageSquare,
  Globe,
  Plus,
  ArrowRight,
  Clock,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Star,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../../App';
import { createSummary } from '../../../lib/summaries';
import { ChatInterface } from './ChatInterface';
import logoImage from '../../../assets/logoicon.png';

interface DashboardContentProps {
  selectedSummaryId: string | null;
  onShowExport: () => void;
  onSummaryCreated: (summaryId: string) => void;
  onToggleSidebar?: () => void;
}

export function DashboardContent({ selectedSummaryId, onShowExport, onSummaryCreated, onToggleSidebar }: DashboardContentProps) {
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
            <div className="text-center mb-8 pt-12 md:pt-0">
              <div className="flex md:hidden absolute top-4 left-4">
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="w-6 h-6 rotate-90" />
                </button>
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-6">
                <img src={logoImage} alt="ClipNote Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">What would you like to summarize?</h1>
              <p className="text-sm md:text-base text-muted-foreground px-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">YouTube</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Summarize videos</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileAudio className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Audio</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Convert to text</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Web Links</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Extract insights</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 flex items-start gap-3">
                <button
                  onClick={onToggleSidebar}
                  className="p-2 md:hidden rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground shrink-0 mt-1"
                >
                  <MessageSquare className="w-5 h-5 rotate-90" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-semibold mb-1 truncate">{selectedSummary.title}</h1>
                  <a
                    href={selectedSummary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1 truncate"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {selectedSummary.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={handleCopy}
                  className="p-2 md:p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors shrink-0"
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
                  className="p-2 md:p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors shrink-0"
                  title="Convert to audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-2 whitespace-nowrap"
                  title="Chat with AI"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
                <button
                  onClick={onShowExport}
                  className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-generated summary</span>
                </div>

                <div className="prose prose-gray max-w-none text-sm md:text-base">
                  <div className="mb-8 space-y-6">
                    {selectedSummary.summary.split('\n').map((paragraph, index) => (
                      <div key={index} className="flex gap-4 group">
                        <span className="text-primary font-mono text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          [{Math.floor(index * 1.5)}:{(index * 15) % 60 === 0 ? '00' : (index * 15) % 60}]
                        </span>
                        <div className="flex-1">
                          <p className="mb-2 leading-relaxed">
                            {paragraph}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <button className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> Show Captions
                            </button>
                            <button className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Translate
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm text-muted-foreground">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-[600px] relative">
            <ChatInterface
              summaryText={selectedSummary.summary}
              summaryTitle={selectedSummary.title}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}