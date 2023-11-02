var fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from = 'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  var to = 'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
}

const options = {
  ignoreAttributes: false,
  stopNodes: ['root.itunes:title'],
  attributeNamePrefix: 'att_',
  removeNSPrefix: true,
};
const parser = new XMLParser(options);

fetch('https://feeds.zencastr.com/f/h5h0nhAi.rss')
  .then((feedTest) => {
    feedTest.text().then((rssFeedData) => {
      let parsedFeed = parser.parse(rssFeedData);
      const allEpisodes = parsedFeed.rss.channel.item;
      allEpisodes.forEach((episode) => {
        let episodeTitle = slugify(episode.title[0]);
        let createStream = fs.createWriteStream(`${episodeTitle}.md`);
        createStream.end();
      });
    });
  })
  .catch(function (err) {
    console.log('Unable to fetch -', err);
  });
