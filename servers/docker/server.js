const fs = require("fs");
const path = require("path");
const Gun = require("gun");

const PORT = 8765;

const public = (() => {
  const public = path.join(__dirname, "files");
  if (fs.existsSync(public)) {
    return public;
  }
  return path.dirname(require.resolve("gun/examples/express"));
})();

const options = (() => {
  const options = path.join(__dirname, "options.json");
  if (fs.existsSync(options)) {
    return JSON.stringify(fs.readFileSync(options, "utf-8"));
  }
  return {};
})();

const server = require("http")
  .createServer(Gun.serve(public))
  .on("listening", () => {
    console.log(`Relay peer started on port ${PORT} with /gun`);
  })
  .on("error", (err) => {
    console.log("Error starting server: ", err);
    process.exit(1);
  });

Gun({ ...options, web: server, multicast: false });

server.listen(PORT);
