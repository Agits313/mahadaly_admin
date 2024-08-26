/* -------------------------------------------------------------------------- */
/*            Docs Swagger, Project starter - Thejagat, andibastian           */
/* -------------------------------------------------------------------------- */

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { SwaggerTheme } = require("swagger-themes");
const theme = new SwaggerTheme("v3");
const swagger_theme_default = {
  syntaxHighlight: {
    activated: true,
    theme: theme,
  },
  defaultModelsExpandDepth: 0,
  defaultModelExpandDepth: 0,
  displayRequestDuration: true,
  persistAuthorization: true,
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swagger_theme_default,
};
