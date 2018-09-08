'use strict';
const Alexa = require('alexa-sdk');
const noModeHandler = require('./handlers/noModeHandlers');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.[unique-app-id]';
const APP_ID =  undefined;

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(noModeHandler);
    try {
        alexa.execute();
    } catch (err){
        console.error('Caught Error: ' + err);
        alexa.emit(':tell', 'Sorry, I\'m experiencing some technical difficulties at the moment. Please try again later.');
    }
};
