import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Plus, 
  Clock, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Play,
  FileAudio,
  FileText
} from 'lucide-react';
import { useApp } from '../../App';
import { signOut } from '../../lib/auth';
import { ThemeToggle } from '../shared/ThemeToggle';
import logoImage from '../../assets/logoicon.png';

interface DashboardSidebarProps {
  selectedSummaryId: string | null;
  onSelectSummary: (id: string | null) => void;
  onShowSettings: () => void;
}

export function DashboardSidebar({ selectedSummaryId, onSelectSummary, onShowSettings }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { user, setUser, summaries } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNewSummary = () => {
    onSelectSummary(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <FileAudio className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <img src={logoImage} alt="ClipNote Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-semibold">ClipNote</span>
        </div>

        <button
          onClick={handleNewSummary}
          className="w-full bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Summary
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 px-2">
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </div>

          {summaries.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No summaries yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first summary to get started
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {summaries.map((summary) => (
                <button
                  key={summary.id}
                  onClick={() => onSelectSummary(summary.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                    selectedSummaryId === summary.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-muted-foreground">
                      {getTypeIcon(summary.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{summary.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(summary.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center justify-between px-3">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle variant="minimal" />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.plan} Plan</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
              showUserMenu ? 'rotate-180' : ''
            }`} />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-20">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onShowSettings();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}