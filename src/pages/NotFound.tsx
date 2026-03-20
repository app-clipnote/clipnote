import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 Number */}
        <div className="relative mb-6">
          <p className="text-[10rem] sm:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-foreground/20 to-foreground/5 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10">
          Looks like this page took a detour. The URL may be wrong, or the page
          may have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border hover:bg-secondary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <button onClick={() => navigate('/auth')} className="hover:text-foreground transition-colors">Sign In</button>
          <button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button>
          <button onClick={() => navigate('/privacy')} className="hover:text-foreground transition-colors">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
