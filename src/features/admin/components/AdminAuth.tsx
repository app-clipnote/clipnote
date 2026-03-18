import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { validateAdminLogin } from '../../../lib/admin-storage';

export function AdminAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isValid = validateAdminLogin(email, password);
      
      if (isValid) {
        // Store admin session
        localStorage.setItem('admin_session', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop" 
            alt="Abstract Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity filter saturate-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
        </div>

        {/* Logo/Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ClipNote AI</span>
          <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ml-2">
            Admin
          </span>
        </div>

        {/* Informational Text */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Secure Platform <span className="font-dancing text-primary text-5xl lg:text-6xl px-1">Control</span>.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Access the command center. Manage users, monitor analytics, and configure the neural engine parameters securely.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-white/50 bg-white/5 border border-white/10 p-4 rounded-xl">
            <Shield className="w-5 h-5 text-primary" />
            <p>Protected by end-to-end encryption and strict access controls.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-card relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Admin Portal</span>
          </div>
          <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>

        {/* Desktop Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="hidden md:flex absolute top-12 right-12 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center gap-2 px-4 py-2 rounded-full hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to website
        </button>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Admin Login
            </h1>
            <p className="text-muted-foreground font-medium">
              Enter your credentials to access the secure admin dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 fade-in">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-destructive">Authentication Error</p>
                <p className="text-sm font-medium text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal"
                  placeholder="admin@clipnote.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Sign In <ArrowLeft className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-8">
            <p className="text-sm font-medium text-muted-foreground">
              Authorized access only. By logging in, you agree to secure monitoring.
            </p>
            <p className="text-xs font-mono bg-secondary/50 rounded-md py-2 mt-4 text-muted-foreground opacity-60">
              admin@clipnote.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
