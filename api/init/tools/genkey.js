const generateApiKey = require("generate-api-key").default;
let key = generateApiKey({ method: "string", min: 30, max: 50, prefix: "Sire_" });
console.log(key);
