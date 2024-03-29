/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
/*jshint esversion: 6 */
const Alexa = require('ask-sdk-core');
const handler = require('ask-sdk');

const SKILL_NAME = 'aces jack zero';
const FALLBACK_MESSAGE_DURING_GAME = 'The ${SKILL_NAME} skill can\'t help you with that.  Try guessing a number between 0 and 100. ';
const FALLBACK_REPROMPT_DURING_GAME = 'Please guess a number between 0 and 100.';
const FALLBACK_MESSAGE_OUTSIDE_GAME = 'The ${SKILL_NAME} skill can\'t help you with that.  It will come up with a number between 0 and 100 and you try to guess it by saying a number in that range. Would you like to play?';
const FALLBACK_REPROMPT_OUTSIDE_GAME = 'Say yes to start the game or no to quit.';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest' || request.session.new;
  },
  handle(handlerInput) 
  {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;
    const attributes = attributesManager.getPersistentAttributes();
    if (Object.keys[attributes].length === 0) 
    {
      attributes.endedSessionCount = 0;
      attributes.gamesPlayed = 0;
      attributes.gameState = 'ENDED';
    }

    attributesManager.setSessionAttributes(attributes);

    const speechOutput = 'Welcome to Aces jack zero guessing game. You have played ${attributes.gamesPlayed.toString()} times. would you like to play?';
    const reprompt = 'Say yes to start the game or no to quit.';
    return responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Thanks for playing!')
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechOutput = 'I am thinking of a number between zero and one hundred, try to guess it and I will tell you' +
            ' if it is higher or lower.';
    const reprompt = 'Try saying a number.';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const YesIntent = {
  canHandle(handlerInput) {
    // only start a new game if yes is said when not playing a game.
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;
    const sessionAttributes = attributesManager.getSessionAttributes();

    sessionAttributes.gameState = 'STARTED';
    sessionAttributes.guessNumber = Math.floor(Math.random * 101);

    return responseBuilder
      .speak('Great! Try saying a number to start the game.')
      .reprompt('Try saying a number.')
      .getResponse();
  },
};

const NoIntent = {
  canHandle(handlerInput) {
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState && sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.endedSessionCount += 1;
    sessionAttributes.gameState = 'ENDED';
    attributesManager.setPersistentAttributes(sessionAttributes);
    attributesManager.savePersistentAttributes();

    return responseBuilder.speak('Ok, see you next time!').getResponse();
  },
};

const UnhandledIntent = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    const outputSpeech = 'Say yes to continue, or no to end the game.';
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();
  },
};

const NumberGuessIntent = {
  canHandle(handlerInput) {
    // handle numbers only during a game
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }
    return isCurrentlyPlaying && request.type === 'IntentRequest' &&
     request.intent.name === 'NumberGuessIntent';
  },
  handle(handlerInput) { 
    const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;

    const guessNum = parseInt(requestEnvelope.request.intent.slots.number.value, 10);
    const sessionAttributes = attributesManager.getSessionAttributes();
    const targetNum = sessionAttributes.guessNumber;

    if (guessNum > targetNum) {
      return responseBuilder
        .speak('${guessNum.toString()} is too high.')
        .reprompt('Try saying a smaller number.')
        .getResponse();
    } else if (guessNum < targetNum) {
      return responseBuilder
        .speak('${guessNum.toString()} is too low.')
        .reprompt('Try saying a larger number.')
        .getResponse();
    } else if (guessNum === targetNum) {
      sessionAttributes.gamesPlayed += 1;
      sessionAttributes.gameState = 'ENDED';
      attributesManager.setPersistentAttributes(sessionAttributes);
      attributesManager.savePersistentAttributes();
      return responseBuilder
        .speak('${guessNum.toString} is correct! Would you like to play a new game?')
        .reprompt('Say yes to start a new game, or no to end the game.')
        .getResponse();
    }
    return handlerInput.responseBuilder
      .speak('Sorry, I didn\'t get that. Try saying a number.')
      .reprompt('Try saying a number.')
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log('Error handled: ${error.message}');

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    // handle fallback intent, yes and no when playing a game
    // for yes and no, will only get here if and not caught by the normal intent handler
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.FallbackIntent' ||
       request.intent.name === 'AMAZON.YesIntent' ||
       request.intent.name === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      // currently playing

      return handlerInput.responseBuilder
        .speak(FALLBACK_MESSAGE_DURING_GAME)
        .reprompt(FALLBACK_REPROMPT_DURING_GAME)
        .getResponse();
    }

    // not playing
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE_OUTSIDE_GAME)
      .reprompt(FALLBACK_REPROMPT_OUTSIDE_GAME)
      .getResponse();
  },
};
const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log('Session ended with reason: ${handlerInput.requestEnvelope.request.reason}');
    return handlerInput.responseBuilder.getResponse();
  },
};

const skillBuilder = SkillBuilders.standard();
let skill;

exports.handler = function (event, context) {
  console.log('REQUEST++++${JSON.stringify(event)}');
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        NumberGuessIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
      )
      .LaunchRequest
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};

export const handlers = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    YesIntent,
    NoIntent,
    NumberGuessIntent,
    FallbackHandler,
    UnhandledIntent
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('aces-jacks-zero')
  .withAutoCreateTable(true)
  .lambda();
  