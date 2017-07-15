const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const fetch = require('node-fetch');
const queryString = require('query-string');
const moment = require('moment');

const botToken = SLACK_BOT_TOKEN || '';

const rtm = new RtmClient(botToken);

// The client will emit an RTM.AUTHENTICATED event on
// successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(
    `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name},
   but not yet connected to a channel`
  );
});

rtm.start();

let threeLastCommenter = [];
const MAX_MESSAGE_SUIT = 3;
const SUNDAY_INDEX_WEEK = 6;

const HELLO_REGEX = /(?=.*hello|bonjour).*/;
const MEILLEUR_REGEX = /(?=.*\b(je)\b)(?=.*\b(suis)\b)(?=.*\b(meilleur)\b).*/i;
const LUNCH_REGEX = /(?=.*\b(midi|12(\s)?h)\b)(?=.*\bmange(r|z|é|r)?\b).*/i;
const WAT_REGEX = /(?=.*\b(quoi|comment|pardon)\b)(?=.*\b(\\?)\b).*/i;
const COCKTAIL_REGEX = /(?=.*\b(cocktail)\b).*/i;
const COCKTAIL2_REGEX = /cocktail (.*)/i;
const THREE_DOTS_REGEX = /^...$/;

/* eslint-disable */
// USERS ID
const PEPITO_ID = 'U63CZSSF5';
const DANYELLOW_ID = 'U62RGB83S';
const OUFF_ID = 'U63GRQCUC';
const NICO_ID = 'U62UAJLCR';
const EMMA_ID = 'U63D9DWGK';
const PASPLUSSE_ID = 'U64BAHK2A';

const SLACKBOT_ID = 'USLACKBOT';
const MOMOBOT_ID = 'U688755ND';

// CHANNELS ID
const DEV_CHANNEL = 'C64NXGFAT';
const GENERAL_CHANNEL = 'C649RN0P8';
const RANDOM_CHANNEL = 'C64A9TR2T';
const EXPERIMENTAL_CHANNEL = 'G688N5RMF';

const PEPITO_YT_LINK = 'https://www.youtube.com/watch?v=N5-F9LiJ468';
/* eslint-enable */

let previousMessage = {};

// const isBotMessage = messageType => (messageType === 'bot_message');
const getRandRestaurantID = () => (Math.round((Math.random() * (23 - 0)) + 0));

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (LUNCH_REGEX.test(message.text)) {
    const botMessage = {
      channel: message.channel,
      text: `<http://goobouffe.danyellow.net/#/${getRandRestaurantID()}|J'ai une suggestion>`,
      as_user: false,
      username: 'momobot'
    };

    const messageParams = queryString.stringify(botMessage);
    const apiCall = `http://slack.com/api/chat.postMessage?token=${botToken}&${messageParams}`;

    fetch(apiCall);
  }

  if (MEILLEUR_REGEX.test(message.text)) {
    rtm.sendMessage(
      `C'est pas possible toujours <@${PEPITO_ID}>, il croit que c'est le meilleur. C'est pas possible`,
      message.channel
    );
  }

  const isThreeLastMessagesFromSameUser = threeLastCommenter.every(
    commenter => message.user === commenter
  );
  if (isThreeLastMessagesFromSameUser &&
    threeLastCommenter.length >= MAX_MESSAGE_SUIT) {
    threeLastCommenter = [];
    rtm.sendMessage(`Heuuu <@${message.user}>, ça te dirait de travailler au lieu de poster ?`, message.channel);
  }

  /**
   * Welcoming message
   */
  if (HELLO_REGEX.test(message.text)) {
    if (message.user === PEPITO_ID) {
      rtm.sendMessage(PEPITO_YT_LINK, message.channel);

      return;
    }
    const prevDayIndex = moment().add(-1, 'days').weekday();
    const baseMessage = `Hello <@${message.user}> !`;
    let welcomeMessage = baseMessage;

    if (prevDayIndex === SUNDAY_INDEX_WEEK) {
      welcomeMessage += ' Alors bon week-end ?';
    }
    rtm.sendMessage(welcomeMessage, message.channel);
  }

  if (THREE_DOTS_REGEX.test(message.text)) {
    rtm.sendMessage(`<@${previousMessage.user}>, <@${message.user}> semble être pantois devant vos propos`, message.channel);
  }

  if (!LUNCH_REGEX.test(message.text) && WAT_REGEX.test(message.text) && previousMessage.text) {
    rtm.sendMessage(`<@${previousMessage.user}> a dit **${previousMessage.text.toUpperCase()}**`, message.channel);
  }

  threeLastCommenter.push(message.user);
  previousMessage = message;
});

// rtm.on(RTM_EVENTS.CHANNEL_JOINED, (user) => {

// });

const lastActiveState = {};
rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (event) => {
  console.log(`${event.user}: ${event.presence}`, event);

  if (event.presence === 'active' &&
    (event.user !== MOMOBOT_ID && event.user !== SLACKBOT_ID)) {
    if (moment().diff(lastActiveState[event.user], 'days') >= 1) {
      return;
    }

    lastActiveState[event.user] = moment();

    if (event.user === PEPITO_ID) {
      rtm.sendMessage(PEPITO_YT_LINK, GENERAL_CHANNEL);

      return;
    }

    rtm.sendMessage(`Bonjour <@${event.user}> !`, GENERAL_CHANNEL); // EXPERIMENTAL_CHANNELGENERAL_CHANNEL
  }
});

/**
 * EXPERIMENTAL
 */
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.channel !== EXPERIMENTAL_CHANNEL) { return; }

  if (COCKTAIL2_REGEX.test(message.text)) { // && message.text.includes(PEPITO_ID)
    const cocktailName = message.text.match(COCKTAIL2_REGEX)[1];
    rtm.sendMessage(`<@${PEPITO_ID}>, <@${message.user}> a demandé un ${cocktailName}. Hop hop hop à son bureau fissa !`, message.channel);
  }
});
