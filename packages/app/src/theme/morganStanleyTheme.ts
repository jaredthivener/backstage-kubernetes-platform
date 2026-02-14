/**
 * Morgan Stanley Custom Backstage Theme
 *
 * Brand colors: Navy (#002F6C), White (#FFFFFF), Light Blue (#0078D4)
 * Following Morgan Stanley brand guidelines for internal tooling.
 */
import {
  createUnifiedTheme,
  palettes,
  genPageTheme,
  shapes,
} from '@backstage/theme';

export const morganStanleyLightTheme = createUnifiedTheme({
  palette: {
    ...palettes.light,
    primary: {
      main: '#002F6C', // Morgan Stanley Navy
      light: '#1A5276',
      dark: '#001A3E',
    },
    secondary: {
      main: '#0078D4', // Accent Blue
      light: '#4DA3E8',
      dark: '#005A9E',
    },
    navigation: {
      background: '#001A3E', // Deep navy sidebar
      indicator: '#0078D4',
      color: '#FFFFFF',
      selectedColor: '#FFFFFF',
      navItem: {
        hoverBackground: '#002F6C',
      },
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    banner: {
      info: '#0078D4',
      error: '#C62828',
      text: '#FFFFFF',
      link: '#4DA3E8',
      warning: '#FF8F00',
    },
    status: {
      ok: '#2E7D32',
      warning: '#FF8F00',
      error: '#C62828',
      running: '#0078D4',
      pending: '#9E9E9E',
      aborted: '#757575',
    },
  },
  fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: ['#002F6C', '#0078D4'],
      shape: shapes.wave,
    }),
    documentation: genPageTheme({
      colors: ['#001A3E', '#002F6C'],
      shape: shapes.wave2,
    }),
    tool: genPageTheme({
      colors: ['#002F6C', '#1A5276'],
      shape: shapes.round,
    }),
    service: genPageTheme({
      colors: ['#0078D4', '#002F6C'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#002F6C', '#4DA3E8'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#001A3E', '#0078D4'],
      shape: shapes.wave,
    }),
    other: genPageTheme({
      colors: ['#002F6C', '#0078D4'],
      shape: shapes.wave,
    }),
    app: genPageTheme({
      colors: ['#0078D4', '#002F6C'],
      shape: shapes.wave,
    }),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#002F6C',
          '&:hover': {
            backgroundColor: '#001A3E',
          },
        },
      },
    },
    BackstageHeader: {
      styleOverrides: {
        header: {
          backgroundImage: 'none',
          boxShadow: '0 2px 4px rgba(0, 47, 108, 0.1)',
        },
      },
    },
    BackstageSidebar: {
      styleOverrides: {
        drawer: {
          background: '#001A3E',
        },
      },
    },
  },
});

export const morganStanleyDarkTheme = createUnifiedTheme({
  palette: {
    ...palettes.dark,
    primary: {
      main: '#4DA3E8',
      light: '#7DBEF0',
      dark: '#0078D4',
    },
    secondary: {
      main: '#0078D4',
      light: '#4DA3E8',
      dark: '#005A9E',
    },
    navigation: {
      background: '#0D1117',
      indicator: '#4DA3E8',
      color: '#FFFFFF',
      selectedColor: '#FFFFFF',
      navItem: {
        hoverBackground: '#161B22',
      },
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    banner: {
      info: '#4DA3E8',
      error: '#EF5350',
      text: '#FFFFFF',
      link: '#7DBEF0',
      warning: '#FFB74D',
    },
    status: {
      ok: '#66BB6A',
      warning: '#FFB74D',
      error: '#EF5350',
      running: '#4DA3E8',
      pending: '#9E9E9E',
      aborted: '#757575',
    },
  },
  fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: ['#0D1117', '#002F6C'],
      shape: shapes.wave,
    }),
    documentation: genPageTheme({
      colors: ['#0D1117', '#001A3E'],
      shape: shapes.wave2,
    }),
    tool: genPageTheme({
      colors: ['#161B22', '#002F6C'],
      shape: shapes.round,
    }),
    service: genPageTheme({
      colors: ['#0D1117', '#0078D4'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#161B22', '#002F6C'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#0D1117', '#0078D4'],
      shape: shapes.wave,
    }),
    other: genPageTheme({
      colors: ['#0D1117', '#002F6C'],
      shape: shapes.wave,
    }),
    app: genPageTheme({
      colors: ['#0D1117', '#0078D4'],
      shape: shapes.wave,
    }),
  },
});
