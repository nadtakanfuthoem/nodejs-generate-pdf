const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({});

exports.handler = async (event, context) => {

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  
    const page = await browser.newPage();
    await page.goto("https://news.ycombinator.com", {
      waitUntil: 'networkidle2',
    });
  
    const pageTitle = await page.title();
  
    console.log(pageTitle);

    const command = new PutObjectCommand({
      Bucket: "nadtakan-s3-pdf-test",
      Key: "test.pdf",
      Body: await page.pdf(),
    });

    const response = await client.send(command);
    console.log(response);

    await browser.close();
  } catch (err) {
    console.error(err);
  }

};