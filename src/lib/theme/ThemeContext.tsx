import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

/**
 * The site is a light / warm-paper design end to end (the brand deliberately
 * avoids dark backgrounds). Dark mode was only ever a partial theme and left
 * several sections with dark-on-dark, unreadable content on phones whose system
 * preference is dark. So the theme is now pinned to light: the `.dark` class is
 * never applied, and the toggle is a no-op kept only so existing callers of
 * useTheme() keep compiling.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const noop = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggle: noop, setTheme: noop }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
