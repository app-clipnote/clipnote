import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../../../App';
import { signIn, signUp } from '../../../lib/auth';
import logoIcon from '../../../assets/logoicon.png';

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const mode = searchParams.get('mode');
  const { setNeedsOnboarding, reloadUser } = useApp();
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        await reloadUser();
        navigate('/dashboard');
      } else {
        await signUp(email, password, name);
        await reloadUser();
        // If they came from a specific pricing card, we'll pass that to onboarding
        setNeedsOnboarding(true);
        navigate(`/onboarding${plan ? `?plan=${plan}` : ''}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        {/* Logo/Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logoIcon} alt="ClipNote Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ClipNote</span>
        </div>

        {/* Testimonial/Quote */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Make the complex <span className="font-dancing text-primary text-5xl lg:text-6xl px-1">simple</span>.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            "ClipNote has completely transformed how our team shares knowledge. Hours of video digested into minutes of reading."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold">Sarah Jenkins</p>
              <p className="text-sm text-white/50">Lead Researcher, TechCorp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-card relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <img src={logoIcon} alt="ClipNote Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight">ClipNote</span>
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
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isLogin 
                ? 'Enter your details to access your dashboard.' 
                : 'Join ClipNote to start summarizing hours of content instantly.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 fade-in">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {/* Social Logins (Mock) */}
          <div className="space-y-3 mb-8">
            <button className="w-full bg-secondary/50 hover:bg-secondary text-foreground font-semibold py-3 px-4 rounded-xl border border-border/50 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`space-y-4 transition-all duration-300 ${!isLogin ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden hidden'}`}>
              <div>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal"
                  required
                  disabled={loading}
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
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border/50 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign in to account' : 'Create free account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline transition-all"
              >
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <p className="mt-8 text-[11px] text-center text-muted-foreground/80 max-w-xs mx-auto leading-relaxed">
              By continuing, you agree to ClipNote's{' '}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}