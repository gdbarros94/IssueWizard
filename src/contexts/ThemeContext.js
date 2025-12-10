import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations inspired by VS Code
const themeVariants = {
  light: {
    default: {
      name: 'Light',
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
      },
    },
    blue: {
      name: 'Light Blue',
      palette: {
        mode: 'light',
        primary: {
          main: '#0078d4',
        },
        secondary: {
          main: '#107c10',
        },
        background: {
          default: '#f3f9ff',
          paper: '#e6f3ff',
        },
      },
    },
    red: {
      name: 'Light Red',
      palette: {
        mode: 'light',
        primary: {
          main: '#d32f2f',
        },
        secondary: {
          main: '#f57c00',
        },
        background: {
          default: '#fff5f5',
          paper: '#ffe6e6',
        },
      },
    },
    yellow: {
      name: 'Light Yellow',
      palette: {
        mode: 'light',
        primary: {
          main: '#f57c00',
        },
        secondary: {
          main: '#fbc02d',
        },
        background: {
          default: '#fffbf0',
          paper: '#fff8e1',
        },
      },
    },
  },
  dark: {
    default: {
      name: 'Dark',
      palette: {
        mode: 'dark',
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      },
    },
    blue: {
      name: 'Dark Blue',
      palette: {
        mode: 'dark',
        primary: {
          main: '#4fc3f7',
        },
        secondary: {
          main: '#81c784',
        },
        background: {
          default: '#0d1117',
          paper: '#161b22',
        },
      },
    },
    red: {
      name: 'Dark Red',
      palette: {
        mode: 'dark',
        primary: {
          main: '#f44336',
        },
        secondary: {
          main: '#ff9800',
        },
        background: {
          default: '#1a0f0f',
          paper: '#2d1a1a',
        },
      },
    },
    yellow: {
      name: 'Dark Yellow',
      palette: {
        mode: 'dark',
        primary: {
          main: '#ffb74d',
        },
        secondary: {
          main: '#ffee58',
        },
        background: {
          default: '#1a1810',
          paper: '#2d2618',
        },
      },
    },
  },
};

export const ThemeProvider = ({ children }) => {
  // Load theme preferences from localStorage
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const [variant, setVariant] = useState(() => {
    const savedVariant = localStorage.getItem('themeVariant');
    return savedVariant || 'default';
  });

  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themeVariant', variant);
  }, [variant]);

  const theme = useMemo(() => {
    const themeConfig = themeVariants[mode][variant];
    return createTheme(themeConfig.palette);
  }, [mode, variant]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setThemeVariant = (newVariant) => {
    setVariant(newVariant);
  };

  const getAvailableThemes = () => {
    return Object.keys(themeVariants[mode]).map((key) => ({
      key,
      name: themeVariants[mode][key].name,
    }));
  };

  const value = {
    mode,
    variant,
    theme,
    toggleMode,
    setThemeVariant,
    getAvailableThemes,
    themeVariants,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
