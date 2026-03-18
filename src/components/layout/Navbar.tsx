import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useApp } from '../../App';
import logoImage from '../../assets/logoicon.png';

export function Navbar() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <header className="bg-background/80 backdrop-blur-md rounded-full border border-border/50 shadow-lg px-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="ClipNote Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">CLIPNOTE</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-muted-foreground/80">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Process</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle variant="minimal" />
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center border border-border transition-all overflow-hidden"
              >
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-primary text-primary-foreground text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-tighter hover:bg-primary/90 transition-all shadow-md"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
