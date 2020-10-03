const http = require('http');
const TeleBot = require('telebot');
const axios = require('axios');
const cheerio = require('cheerio');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

cache = {htmlData: undefined, lastUpdated: undefined};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function isCacheAlive() {
  if (cache.htmlData && cache.lastUpdated) {
    timeDiff = new Date() - cache.lastUpdated;
    if (timeDiff < 86400000) { //86400000 is 1 day in milliseconds
      return true;
    }
  }
  return false;
};

async function getUnisportHTMLData() {
  if (isCacheAlive()) {
    return cache.htmlData;
  }

  let htmlData;
  axios.get('https://unisport.fi/kavijamaarat')
    .then(function (response) {
      htmlData = response.data;
      cache.htmlData = htmlData;
      cache.lastUpdated = new Date();
    })
    .catch(function (error) {
      // handle error
    })
    .then(function () {
      // always executed
    });

  return htmlData;
};

function parseURL(htmlData) {
  urls = {kluuvi: "", kumpula: "", meilahti: "", otaniemi: "", toolo: ""};
  const $ = cheerio.load(htmlData);
  // TODO: Parse the image urls here

  return urls;
};

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));
bot.on('/kluuvi', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Kluuvi.jpg?itok=7ne4C-jt/get');
});
bot.on('/kumpula', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Kumpula.jpg?itok=gWAdCQja/get');
});
bot.on('/meilahti', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Meilahti.jpg?itok=-jVdotjz/get');
});
bot.on('/otaniemi', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Otaniemi.jpg?itok=0w9KWdQT/get');
});
bot.on('/toolo', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20T%C3%B6%C3%B6l%C3%B6.jpg?itok=NfR4-zlT/get');
});

bot.start();