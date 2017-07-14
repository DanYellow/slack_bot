rootJS;

const MERCI_QUI = 'merci qui ?';
const BRAN_EMOJIS = ':branlolo::branlala::branlolo::branlala::branlolo::branlala:';

/* eslint-disable */
// USERS ID
/* eslint-enable */

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (MERCI_QUI === message.text) {
    setTimeout(() => {
      rtm.sendMessage(
        'bran',
        message.channel
      );
    }, 1000);
  }
});
