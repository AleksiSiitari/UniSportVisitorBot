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

const locations = {
  kluuvi: { name: 'Kluuvi', mapLink: 'https://goo.gl/maps/NVoVkKrgP3RdPX3H9' },
  kumpula: { name: 'Kumpula', mapLink: 'https://goo.gl/maps/qL9QJDmoCao5QC3RA' },
  meilahti: { name: 'Meilahti', mapLink: 'https://goo.gl/maps/rBPzmgTxq19bxXvy7' },
  otaniemi: { name: 'Otaniemi', mapLink: 'https://goo.gl/maps/dHomZdpwQh4Ccx1R9' },
  toolo: { name: 'Töölö', mapLink: 'https://goo.gl/maps/xvdqyP29ZAWDa6ae7' },
};

const realtimeUrl = (locationName) => `https://embed.gymplus.fi/v2/update/${locationName}`;
const url = (locationName, weekNumber) => `https://www.unisport.fi/sites/default/files/styles/content_image_2xl/public/media/images/${encodeURI(locationName)}%20vko%20${weekNumber}.png`;

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
// eslint-disable-next-line no-extend-native
Date.prototype.getWeekNumber = function getWeekNumber() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getRealtimeData = async (locationName) => {
  const response = await fetch(realtimeUrl(locationName));
  const body = await response.json();
  return body;
};

const createImageURL = async (locationName) => {
  const lastWeek = (new Date()).getWeekNumber() - 1;
  const fetchResults = await fetch(url(locationName, lastWeek), { method: 'HEAD' });
  if (fetchResults.ok) {
    return { url: url(locationName, lastWeek), week: lastWeek };
  }
  const weekBeforeLastWeek = lastWeek - 1;
  return { url: url(locationName, weekBeforeLastWeek), week: weekBeforeLastWeek };
};

const reply = async (msg, location) => {
  try {
    const result = await createImageURL(location.name);
    msg.reply.photo(result.url, { parseMode: 'HTML', caption: `<a href="${location.mapLink}">${location.name}</a>, average number of visitors on week ${result.week}` });
  } catch (error) {
    console.log(new Error(error));
    msg.reply.text('There was an error fetching the data', { asReply: true });
  }
};

const replyWithRealtimeData = async (msg, location) => {
  try {
    const data = await getRealtimeData(location.name.toLowerCase());
    const { realtime, predictions } = data;
    const jsonPredictions = JSON.parse(predictions);
    msg.reply.text(`At the gym now: ${realtime.total.object_count}/${realtime.total.estimated_capacity}. Predicted capacity after ${jsonPredictions[1].title}: ${jsonPredictions[1].percent}, ${jsonPredictions[2].title}: ${jsonPredictions[2].percent}.`, { asReply: true });
  } catch (error) {
    console.log(new Error(error));
    msg.reply.text('There was an error fetching the realtime data', { asReply: true });
  }
};

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));
bot.on('/kluuvi', (msg) => replyWithRealtimeData(msg, locations.kluuvi));
bot.on('/kumpula', (msg) => reply(msg, locations.kumpula));
bot.on('/meilahti', (msg) => reply(msg, locations.meilahti));
bot.on('/otaniemi', (msg) => reply(msg, locations.otaniemi));
bot.on('/toolo', (msg) => reply(msg, locations.toolo));

bot.start();
