import express from "express";
import { htmlGenerator, jsxGenerator } from "./generator";
import { readFile } from "fs/promises";

const app = express();
const port = 3000;

app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/client.js") {
    const content = await readFile("./client.js", "utf8");

    res.setHeader("Content-Type", "text/javascript");
    res.end(content);
  } else if (url.searchParams.has("jsx")) {
    url.searchParams.delete("jsx"); // Keep the url passed to the <Router> clean
    const jsxContent = await jsxGenerator(url);

    res.setHeader("Content-Type", "application/json");
    res.end(jsxContent);
  } else {
    const htmlContent = await htmlGenerator(url);

    res.setHeader("Content-Type", "text/html");
    res.end(htmlContent);
  }
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`);
});
