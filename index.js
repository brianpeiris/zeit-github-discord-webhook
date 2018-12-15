const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { promisify } = require("util");
let jsonBody = require("body/json");
jsonBody = promisify(jsonBody);

const eventFilter = ["pull_request"];
const actionFilter = ["closed", "labeled"];
const labelFilter = ["whats new"];
const baseFilter = ["master"];

module.exports = async (req, res) => {
  const h = new URLSearchParams(req.url.split("?")[1]).get("h");
  if (!h) { res.end(); return; }

  const eventName = req.headers["x-github-event"];

  if (!eventFilter.includes(eventName)) { res.end(); return; }

  const event = await jsonBody(req);

  if (event.action) {
    if (!actionFilter.includes(event.action)) { res.end(); return; }
  }

  if (event.pull_request) {
    const matchesLabelFilter = event.pull_request.labels.some(label => labelFilter.includes(label.name));
    const matchesBaseFilter = baseFilter.includes(event.pull_request.base.ref);
    if (!matchesLabelFilter || !matchesBaseFilter || !event.pull_request.merged) { res.end(); return; }

    const pr = event.pull_request;

    const paragraphs = pr.body.split("\r\n\r\n").filter(l => l.trim());
    const imageUrl = paragraphs[1] && paragraphs[1].includes("![") && paragraphs[1].split(/[()]/)[1];

    const body = {
      embeds: [{
        title: pr.title,
        description: paragraphs[0],
        url: pr.url,
        image: imageUrl ? { url: imageUrl } : null
      }]
    };

    await fetch(`https://discordapp.com/api/webhooks/${h}`, {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  res.end();
}
