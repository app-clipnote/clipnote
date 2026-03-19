import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useApp } from '../../App';
import logoImage from '../../assets/logoicon.png';

export function Navbar() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Process', href: '#how-it-works' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="fixed top-3 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-3 sm:px-6">
      <header className="bg-background/80 backdrop-blur-md rounded-full border border-border/50 shadow-lg px-8 py-4 transition-all">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <img src={logoImage} alt="ClipNote Logo" className="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">CLIPNOTE</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-muted-foreground/80">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeToggle variant="minimal" />
            </div>
            
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center border border-border transition-all overflow-hidden"
              >
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-6">
                <button
                  onClick={() => navigate('/auth')}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-primary text-primary-foreground text-[12px] font-bold px-6 py-3 rounded-full uppercase tracking-tighter hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-4 bg-background/95 backdrop-blur-xl rounded-[2rem] border border-border/50 shadow-2xl p-6 sm:p-8 overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-2 border-b border-border/30"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pt-4"
              >
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle variant="minimal" />
              </motion.div>
              {!user && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4 mt-6"
                >
                  <button
                    onClick={() => { navigate('/auth'); setIsOpen(false); }}
                    className="w-full py-4 text-center font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { navigate('/auth'); setIsOpen(false); }}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                  >
                    Get Started Free
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
