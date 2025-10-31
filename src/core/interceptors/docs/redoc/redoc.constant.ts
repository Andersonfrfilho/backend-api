export const REDOC_HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ReDoc - API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <link rel="icon" href="https://st4.depositphotos.com/16253490/21017/v/450/depositphotos_210178828-stock-illustration-api-icon-vector-sign-and.jpg" type="image/jpg">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Roboto', sans-serif;
            background: #fafafa;
          }
          redoc {
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --text-color: #333;
            --border-color: #e8e8e8;
            --bg-color: #ffffff;
          }
          .redoc-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }
          .redoc-header img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px;
          }
          .redoc-header-content h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0;
          }
          .redoc-header-content p {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="redoc-header">
          <img src="https://st4.depositphotos.com/16253490/21017/v/450/depositphotos_210178828-stock-illustration-api-icon-vector-sign-and.jpg" alt="API Logo">
          <div class="redoc-header-content">
            <h1>Backend Service API</h1>
            <p>API Documentation - ReDoc</p>
          </div>
        </div>
        <redoc spec-url='/swagger-spec' expand-single-schema="true" hide-hostname="false"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
      </body>
    </html>
  `;
