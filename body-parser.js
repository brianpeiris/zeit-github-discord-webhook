function bodyParser(body, useEntireBody) {
  const imageRegex = /!\[.*\]\((.+)\)/;
  const matches = body && body.match(imageRegex);
  const firstImageUrl = matches && matches[1];

  let description;
  if (useEntireBody) {
    description = body;
  } else {
    const paragraphs = body.split("\r\n\r\n").filter(l => l.trim());
    description = paragraphs[0];
  }
  description = description || "";

  // Strip images
  description = description.replace(/\s*!\[.*\]\(.+\)\s*/g, " ").trim()

  return { description, firstImageUrl };
}

module.exports = bodyParser;
