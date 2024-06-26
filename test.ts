import dotenv from "dotenv";
import got from "got";
import { spawn } from "child_process";
import test from "tape";

dotenv.config();

// Start the app
const env = Object.assign({}, process.env, { PORT: 5000 });
const child = spawn("node", ["server.js"], { env });

test("responds to requests", (t) => {
  t.plan(4);

  // Wait until the server is ready
  child.stdout.on("data", (_) => {
    // Make a request to our app
    void (async () => {
      const response = await got("http://127.0.0.1:5000");
      // stop the server
      child.kill();
      // No error
      t.false(response.statusCode);
      // Successful response
      t.equal(response.statusCode, 200);
      // Assert content checks
      t.notEqual(
        response.body.indexOf(
          "<title>Node.js Getting Started on Heroku</title>"
        ),
        -1
      );
      t.notEqual(
        response.body.indexOf("Getting Started on Heroku with Node.js"),
        -1
      );
    })();
  });
});
