const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = process.env.SLACK_BOT_TOKEN || '';



const rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.start();

// rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function (message) {  
//   var user = rtm.dataStore.getUserById(rtm.activeUserId);

//   // Get the team's name
//   var team = rtm.dataStore.getTeamById(rtm.activeTeamId);

//   // Log the slack team name and the bot's name
//   console.log('Connected to ' + team.name + ' as ' + user.name);
// });


const threeLastCommenter = [];
const MAX_MESSAGE_SUIT = 2;

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  const channel = '#so_me';

  if (/(?=.*\b(midi|12h|12 h)\b)(?=.*\bmange(r|z|é?)\b).*/.test(message.text)) {
    rtm.sendMessage(
      `Vous avez vérifié sur googlebouffe ?`, 
      message.channel
    );
  }

  if (message.user === 'U62RGB83S' && 
      /(?=.*\b(meilleur)\b).*/.test(message.text)
    ) {
    rtm.sendMessage(
      `C'est pas possible toujours @pepito, il croit que c'est le meilleur. C'est pas possible`, 
      message.channel
    );
  }

  if (threeLastCommenter.every((commenter) => message.user === commenter) && 
    threeLastCommenter.length >= MAX_MESSAGE_SUIT ) {

    threeLastCommenter.length = 0
    rtm.sendMessage(`Heuuu <@${message.user}>, ça te dirait de travailler au lieu de poster ?`, message.channel);
  }

  if (message.text === 'Hello.') {
    
    rtm.sendMessage(`Hello <@${message.user}> !`, message.channel);
  }

  threeLastCommenter.push(message.user);
});


