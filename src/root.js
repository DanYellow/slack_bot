/* eslint-disable */

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

/* eslint-enable */
