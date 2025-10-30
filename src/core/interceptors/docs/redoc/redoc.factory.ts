import { generateReDocTheme } from './redoc.theme';
import { ReDocConfig, DEFAULT_REDOC_CONFIG } from './redoc.config';

export function generateReDocHtml(config: Partial<ReDocConfig> = {}): string {
  const finalConfig = { ...DEFAULT_REDOC_CONFIG, ...config };

  const themeJson = generateReDocTheme(finalConfig.theme);
  console.log('############=>', themeJson, finalConfig);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${finalConfig.title}</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="API Documentation">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Montserrat', 'Roboto', sans-serif;
            background-color: #fafafa;
          }
          
          /* Loading state */
          html:not(.redoc-loaded) {
            background-color: #fafafa;
          }
        </style>
      </head>
      <body>
        <redoc id="redoc-container"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
        <script>
          // Usar Redoc.init() com configuração de tema
          Redoc.init(
            '${finalConfig.specUrl}',
            ${themeJson},
            document.getElementById('redoc-container')
          );
        </script>
      </body>
    </html>
  `;
}
