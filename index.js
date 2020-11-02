const PORT = process.env.PORT || 8080;
const PROXY_URL =
  "https://recent-messages.robotty.de/api/v2/recent-messages/moonmoon";

// const proxy = require("express-http-proxy");
const https = require("https");
const app = require("express")();
// app.use(
//   "/recent-messages/moonmoon",
//   proxy(PROXY_URL, {
//     https: true,
//     filter: (req, _, err) => {
//       return new Promise((resolve) => {
//         if (err) {
//           console.error(err.message);
//           resolve(false);
//         }
//         resolve(req.method === "GET");
//       });
//     },
//   })
// );
//
// app.listen(PORT, () => console.log(`proxy up`))
app.use("/proxy", (req, res) => {
  try {
    https.get(PROXY_URL, (proxyResp) => {
      let proxyResponseString = "";

      proxyResp.on("data", (buffer) => {
        proxyResponseString += buffer.toString();
      });
      proxyResp.on("close", () => {
        const json = JSON.parse(proxyResponseString);
        res.send(json);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
app.use("/", (_, res) =>
  setTimeout(() => {
    res.redirect("https://recent-messages.robotty.de/api/");
  }, 6.9 * 1000)
);

app.listen(PORT, () => console.log("up; PORT: ", PORT));
