/**
 * Exemplos de uso do ReDoc com tema customizado
 *
 * Este arquivo demonstra diferentes formas de customizar o tema do ReDoc
 */

import { docsFactory, ReDocThemeConfig } from '@core/interceptors/docs';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

/**
 * Exemplo 1: Uso padrão
 * Usa as cores padrão da aplicação
 */
export function setupDocsDefault(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  docsFactory({ app, document });
}

/**
 * Exemplo 2: Tema customizado com cores da marca
 */
export function setupDocsWithBranding(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  const brandTheme: ReDocThemeConfig = {
    primaryColor: '#1976d2', // Azul corporativo
    secondaryColor: '#42a5f5', // Azul claro
    accentColor: '#1976d2',
    logoUrl: 'https://seu-domain.com/logo.png',
    logoAltText: 'Seu Logo',
  };

  docsFactory({
    app,
    document,
    redoc: {
      title: 'Seu Projeto - API Documentation',
      theme: brandTheme,
    },
  });
}

/**
 * Exemplo 3: Tema escuro (Dark mode)
 */
export function setupDocsDarkTheme(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  const darkTheme: ReDocThemeConfig = {
    primaryColor: '#64b5f6', // Azul claro para fundo escuro
    secondaryColor: '#42a5f5',
    accentColor: '#64b5f6',
    backgroundColor: '#1e1e1e',
    textColor: '#e0e0e0',
    borderColor: '#333333',
  };

  docsFactory({
    app,
    document,
    redoc: {
      title: 'API Documentation - Dark Mode',
      theme: darkTheme,
    },
  });
}

/**
 * Exemplo 4: Tema verde (Sucesso/Segurança)
 */
export function setupDocsGreenTheme(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  const greenTheme: ReDocThemeConfig = {
    primaryColor: '#4caf50', // Verde sucesso
    secondaryColor: '#66bb6a',
    accentColor: '#81c784',
    backgroundColor: '#f5f5f5',
    textColor: '#212121',
    borderColor: '#e0e0e0',
  };

  docsFactory({
    app,
    document,
    redoc: {
      title: 'API Documentation - Success Theme',
      theme: greenTheme,
    },
  });
}

/**
 * Exemplo 5: Tema roxo (Premium/Elegante)
 */
export function setupDocsPurpleTheme(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  const purpleTheme: ReDocThemeConfig = {
    primaryColor: '#7c3aed', // Roxo Premium
    secondaryColor: '#a78bfa',
    accentColor: '#c4b5fd',
    backgroundColor: '#f9f5ff',
    textColor: '#2d1b4e',
    borderColor: '#ddd6fe',
  };

  docsFactory({
    app,
    document,
    redoc: {
      title: 'API Documentation - Premium',
      theme: purpleTheme,
    },
  });
}

/**
 * Exemplo 6: Tema baseado em variáveis de ambiente
 */
export function setupDocsFromEnv(
  app: NestFastifyApplication,
  document: Record<string, any>,
) {
  const envTheme: ReDocThemeConfig = {
    primaryColor: process.env.REDOC_PRIMARY_COLOR || '#dd5900',
    secondaryColor: process.env.REDOC_SECONDARY_COLOR || '#f39200',
    logoUrl: process.env.REDOC_LOGO_URL,
    logoAltText: process.env.REDOC_LOGO_ALT_TEXT || 'Logo',
  };

  docsFactory({
    app,
    document,
    redoc: {
      title: process.env.REDOC_TITLE || 'API Documentation',
      theme: envTheme,
    },
  });
}
