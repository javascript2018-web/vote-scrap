const app = require("./app");
const database = require("./database/database");

require("dotenv").config();
const port = process.env.PORT || 5005;
// server configurations

database();

// Start the server
app.listen(port, () => {
  console.log("server is run start", port);
});
