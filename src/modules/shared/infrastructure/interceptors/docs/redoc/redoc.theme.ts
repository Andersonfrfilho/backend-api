export interface ReDocThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  logoUrl?: string;
  logoAltText?: string;
}

export const DEFAULT_REDOC_THEME: ReDocThemeConfig = {
  primaryColor: '#dd5900',
  secondaryColor: '#f39200',
  accentColor: '#dd5900',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e8e8e8',
  logoUrl:
    'https://st4.depositphotos.com/16253490/21017/v/450/depositphotos_210178828-stock-illustration-api-icon-vector-sign-and.jpg',
  logoAltText: 'Backend API Template Service Logo',
};

export function generateReDocTheme(customTheme?: Partial<ReDocThemeConfig>): string {
  const theme = { ...DEFAULT_REDOC_THEME, ...customTheme };

  return JSON.stringify({
    colors: {
      primary: {
        main: theme.primaryColor,
        light: theme.secondaryColor,
        dark: theme.primaryColor,
        contrastText: '#ffffff',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
        contrastText: '#ffffff',
      },
      error: {
        main: '#f44336',
        light: '#ef5350',
        dark: '#d32f2f',
        contrastText: '#ffffff',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
        contrastText: '#ffffff',
      },
      text: {
        primary: theme.textColor,
        secondary: '#666666',
      },
      border: theme.borderColor,
      background: {
        paper: theme.backgroundColor,
        default: '#fafafa',
      },
    },
    typography: {
      fontSize: '14px',
      fontFamily: "'Montserrat', 'Roboto', sans-serif",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightBold: 700,
      lineHeight: 1.5,
      headings: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 600,
      },
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#fafafa',
      textColor: '#333333',
      activeBackgroundColor: '#f0f0f0',
      activeBorderColor: theme.primaryColor,
      activeTextColor: theme.primaryColor,
      groupItems: {
        activeBackgroundColor: theme.primaryColor,
        activeTextColor: '#ffffff',
      },
    },
    rightPanel: {
      backgroundColor: '#f5f5f5',
      width: '40%',
    },
    codeBlock: {
      backgroundColor: '#292d3e',
      textColor: '#ffffff',
    },
    links: {
      color: theme.primaryColor,
      visited: theme.accentColor,
      hover: theme.secondaryColor,
    },
    spacing: {
      unit: 5,
      sectionVertical: 40,
      sectionHorizontal: 40,
    },
  }).replaceAll('"', "'");
}
