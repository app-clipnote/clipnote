import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTheme, toggleTheme, type Theme } from '../../lib/theme';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="flex items-center gap-2">
        {theme === 'dark' ? (
          <>
            <Moon className="w-4 h-4" />
            <span className="text-sm font-medium">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            <span className="text-sm font-medium">Light</span>
          </>
        )}
      </div>
    </button>
  );
}
