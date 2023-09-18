import { generateMetaTags, generateBodyContent, generateCSS, generateJavaScript } from './generators/generators';
import { config } from '../config';
// template for Home Page

export const HTML_TEMPLATE = (parsedData: string) => `
  <!DOCTYPE html>
  <html lang="en">
	<head>
	  ${generateMetaTags(config.HomePageMetaTags)}
	  <title>Quote Generator Powered by Fauna and Cloudflare Workers</title>
	  <link rel="icon" type="image/x-icon" href="https://imagedelivery.net/HML6qmlXDXx6EPV6zNm9VA/c6bccf1c-fbae-40b8-8c22-08f7043e2400/square">
	  <style>${generateCSS()}</style>
	</head>
	<body>
	  ${generateBodyContent()}
	  <script>${generateJavaScript(parsedData)}
	  </script>
	</body>
  </html>
  `;
