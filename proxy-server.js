const express = require("express");
const fetch = require("node-fetch");
const app = express();

const TARGET_URL = "http://crazycattle3d.com";

app.get("/proxy", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL);
    const html = await response.text();
    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching proxy content");
  }
});

app.listen(3000, () => {
  console.log("Proxy server running at http://localhost:3000");
});
