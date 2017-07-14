const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const fetch = require('node-fetch');
const queryString = require('query-string');
const moment = require('moment');

const botToken = SLACK_BOT_TOKEN || '';
const EXPERIMENTAL_CHANNEL = 'G688N5RMF'; // #so_me;

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

/* eslint-disable */
// USERS ID
const PEPITO_ID = 'U63CZSSF5';
const DANYELLOW_ID = 'U62RGB83S';
const OUFF_ID = 'U63GRQCUC';
const NICO_ID = 'U62UAJLCR';
const EMMA_ID = 'U63D9DWGK';
const PASPLUSSE_ID = 'U64BAHK2A';

// CHANNELS ID
const DEV_CHANNEL = 'C64NXGFAT';
const GENERAL_CHANNEL = 'C649RN0P8';
const RANDOM_CHANNEL = 'C64A9TR2T';
const SECRET_CHANNEL = 'C649RN0P8';
/* eslint-enable */

let previousMessage = {};

// const isBotMessage = messageType => (messageType === 'bot_message');
const getRandRestaurantID = () => (Math.round(Math.random() * (23 - 0) + 0));

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
      'C\'est pas possible toujours <@U62RGB83S>, il croit que c\'est le meilleur. C\'est pas possible',
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
      rtm.sendMessage(
        'https://www.youtube.com/watch?v=N5-F9LiJ468',
        message.channel
      );
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

  if (!LUNCH_REGEX.test(message.text) && WAT_REGEX.test(message.text) && previousMessage.text) {
    rtm.sendMessage(`<@${previousMessage.user}> a dit **${previousMessage.text.toUpperCase()}**`, message.channel);
  }

  threeLastCommenter.push(message.user);
  previousMessage = message;
});

// rtm.on(RTM_EVENTS.CHANNEL_JOINED, (user) => {

// });

// rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (event) => {
//   console.log(event.user + ': ' + event.presence, event);
//   // rtm.sendMessage(`Heuuu <@${message.user}>, 
//   ça te dirait de travailler au lieu de poster ?`, message.channel);
// });

/**
 * EXPERIMENTAL
 */
// rtm.on(RTM_EVENTS.MESSAGE, (message) => {
//   if (message.channel !== EXPERIMENTAL_CHANNEL) { return; }
//   console.log('hello');
// });
