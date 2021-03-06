const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { promisify } = require("util");
let jsonBody = require("body/json");
jsonBody = promisify(jsonBody);

const bodyParser = require("./body-parser");

const eventFilter = ["pull_request"];
const actionFilter = ["closed", "labeled"];
const labelFilter = ["whats new"];
const baseFilter = ["master"];

module.exports = async (req, res) => {
  const discordHook = new URLSearchParams(req.url.split("?")[1]).get("h");
  if (!discordHook) {
    res.end();
    return;
  }

  const eventName = req.headers["x-github-event"];
  if (!eventFilter.includes(eventName)) {
    res.end();
    return;
  }

  const event = await jsonBody(req);
  if (event.action) {
    if (!actionFilter.includes(event.action)) {
      res.end();
      return;
    }
  }

  if (!event.pull_request) {
    res.end();
    return;
  }

  const pr = event.pull_request;

  const matchesLabelFilter = pr.labels.some(label => labelFilter.includes(label.name));
  const matchesBaseFilter = baseFilter.includes(pr.base.ref);
  if (!matchesLabelFilter || !matchesBaseFilter || !pr.merged) {
    res.end();
    return;
  }

  const { body } = pr;

  const { description, firstImageUrl } = bodyParser(body, process.env.USE_ENTIRE_BODY === "true");

  const postBody = {
    embeds: [
      {
        title: pr.title,
        description,
        url: pr.html_url,
        image: firstImageUrl ? { url: firstImageUrl } : null
      }
    ]
  };

  await fetch(`https://discordapp.com/api/webhooks/${discordHook}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(postBody)
  });

  res.end();
};
