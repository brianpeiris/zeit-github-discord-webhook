const bodyParser = require("./body-parser");

test("simple description", () => {
  const body = "simple description";
  const { description, firstImageUrl } = bodyParser(body);
  expect(description).toBe("simple description");
  expect(firstImageUrl).toBe(null);
});

test("first paragraph", () => {
  const body = "para one\r\n\r\npara two";
  const { description, firstImageUrl } = bodyParser(body);
  expect(description).toBe("para one");
  expect(firstImageUrl).toBe(null);
});

test("full body", () => {
  const body = "para one\r\n\r\npara two";
  const { description, firstImageUrl } = bodyParser(body, true);
  expect(description).toBe(body);
  expect(firstImageUrl).toBe(null);
});

test("first para and first image", () => {
  const body = "para one\r\n\r\n![an image](https://example.com/image.png)\r\n\r\npara two";
  const { description, firstImageUrl } = bodyParser(body);
  expect(description).toBe("para one");
  expect(firstImageUrl).toBe("https://example.com/image.png");
});

test("strip images from description", () => {
  const body = `para one\r\n\r\npara two\r\n\r\nHere's an image ![an image](https://example.com/image.png) for you.`;
  const { description, firstImageUrl } = bodyParser(body, true);
  expect(description).toBe("para one\r\n\r\npara two\r\n\r\nHere's an image for you.");
  expect(firstImageUrl).toBe("https://example.com/image.png");
});

test("first para with special chars and first image", () => {
  const firstPara = "para (one) has parens and ![] things like () images";
  const body = `${firstPara}\r\n\r\npara two\r\n\r\n![an image](https://example.com/image.png)`;
  const { description, firstImageUrl } = bodyParser(body);
  expect(description).toBe(firstPara);
  expect(firstImageUrl).toBe("https://example.com/image.png");
});
