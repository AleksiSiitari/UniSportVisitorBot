const http = require('http');
const TeleBot = require('telebot');
const fetch = require('node-fetch');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

async function createImageURL(location) {
  const lastWeek = (new Date).getWeekNumber(); //- 1;
  const url = `https://unisport.fi/sites/default/files/styles/content_image_2xl/public/media/images/Viikko%20${lastWeek}%20-%20${location}.jpg`;
  
  fetchResults = await fetch(url, { method: 'HEAD' })
    .then(res => {
          if (res.ok) {
              return url;
          } else {
            const weekBeforeLastWeek = lastWeek - 1; //Try to fallback to previous weeks data
            return `https://unisport.fi/sites/default/files/styles/content_image_2xl/public/media/images/Viikko%20${weekBeforeLastWeek}%20-%20${location}.jpg`;
          }
      })
      .catch(err => console.log('Error:', err));

  return fetchResults;
};

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));
bot.on('/kluuvi', (msg) => {
  createImageURL("Kluuvi").then(result =>
    msg.reply.photo(result, {parseMode: 'HTML', caption: `<a href="https://goo.gl/maps/NVoVkKrgP3RdPX3H9">Kluuvi</a>, average number of visitors on week ${(new Date).getWeekNumber() - 1}`})
  );
});
bot.on('/kumpula', (msg) => {
  createImageURL("Kumpula").then(result =>
    msg.reply.photo(result, {caption: `Kumpula, average number of visitors on week ${(new Date).getWeekNumber() - 1}`})
  );
});
bot.on('/meilahti', (msg) => {
  createImageURL("Meilahti").then(result =>
    msg.reply.photo(result, {caption: `Meilahti, average number of visitors on week ${(new Date).getWeekNumber() - 1}`})
  );
});
bot.on('/otaniemi', (msg) => {
  createImageURL("Otaniemi").then(result =>
    msg.reply.photo(result, {caption: `Otaniemi, average number of visitors on week ${(new Date).getWeekNumber() - 1}`})
  );
});
bot.on('/toolo', (msg) => {
  createImageURL("Töölö").then(result =>
    msg.reply.photo(result, {caption: `Töölö, average number of visitors on week ${(new Date).getWeekNumber() - 1}`})
  );
});

bot.start();