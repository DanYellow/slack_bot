const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

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

const HELLO_REGEX = /(?=.*hello|bonjour).*/i;
const STREETW_REGEX = /(?=.*street(workout)?).*/i;

const SUNDAY_INDEX_WEEK = 6;

/* eslint-disable */
// USERS ID
const FANG_ID = 'U0BUHH5KJ';
const NEV_ID = 'U0BUEELR5';
const DAN_ID = 'U0C3H5MC5';
/* eslint-enable */

const EXCUSES_LIST = [
  'Il y a ma tante chez moi, je ne peux pas la laisser toute seule',
  'J\'ai un impératif',
  'J\'ai du travail',
  'J\'ai des exams',
  'Il pleut',
  'J\'ai des formalités administratives à régler',
  'Je ne sais pas encore',
  'Je vais à la piscine',
  'Je suis dehors depuis 9 heures et j’ai des trucs à faire',
  'Je suis à MyPlace. Je suis dehors depuis 9h',
  '(Nan) Je ne sport pas, je serai occupé',
  'Je suis blessé, j’ai une contracture',
  'Blessé mon ami',
  'J’ai chaud',
  'En plus d’être fatigué, j’ai mal ici',
  'Mariage',
  'Je repousse la séance à Dimanche. Je ne pourrai pas demain',
  'Absent encore. Présence pour famille requise.',
  'J\'ai dû aller à la poste faire la queue pendant 3h',
  'J\'arrête les séances de street. J\'aurai beaucoup à faire dans les prochaines semaines comme je fais de travaux et ce sera difficile d\'allier le temps et la fatigue le dimanche. Je reviendrai bien plus tard. Pour l\'instant, c\'est stand by.',
  'Je suis rentré à 8h20. Je suis ko, je dois dormir encore',
  'Je dépose ma mère à l\'aéroport à 6h du mat',
  'Occupé ce week-end',
  'Je range et je code'
];

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (HELLO_REGEX.test(message.text)) {
    const prevDayIndex = moment().add(-1, 'days').weekday();
    const baseMessage = `Hello <@${message.user}> !`;
    let welcomeMessage = baseMessage;

    if (prevDayIndex === SUNDAY_INDEX_WEEK) {
      welcomeMessage += ' Alors bon week-end ?';
    }

    rtm.sendMessage(welcomeMessage, message.channel);
  }

  if (STREETW_REGEX.test(message.text)) {
    const randomExcuse = EXCUSES_LIST[Math.floor(Math.random() * EXCUSES_LIST.length)];
    const botMessage = `<@U0BUEELR5> ! Inutile de répondre, j'ai une excuse pour vous : \n ${randomExcuse}`;

    rtm.sendMessage(botMessage, message.channel);
  }
});
