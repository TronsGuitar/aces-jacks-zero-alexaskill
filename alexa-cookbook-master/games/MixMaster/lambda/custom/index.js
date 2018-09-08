'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'mixMaster';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            setUserStatus.call(this, "easy", 0);
        }
        this.emit("LaunchRequest");
    },
    'LaunchRequest': function() {
        getPrompt.call(this, "<audio src='" + songs['intro'] + "' /> Welcome to Mix Master! ");
    },
    'QuestionIntent': function() {
        getPrompt.call(this, "");
    },
    'AnswerIntent': function () {
        //get and check the answer
        let stage = this.attributes['currentStage'];
        let level = parseInt(this.attributes['currentLevel']);

        let slotValues = getSlotValues(this.event.request.intent.slots);
        let givenAnswer = slotValues.answer.resolved;
        let correctAnswer = mixMasterElements[stage][level].answer;

        let speechOutput = "";

        if(correctAnswer.toUpperCase() == givenAnswer.toUpperCase()) {
            speechOutput += "<audio src='" + songs['correct'] + "' />" + getSpeechCon(true)+ " you got it! " + givenAnswer + " was right. ";
            
            // increase their level
            this.attributes['currentLevel'] = parseInt(level) + 1;
            checkUserStatus.call(this);

            if (this.attributes['currentStage'] == "easy" && parseInt(this.attributes['currentLevel']) == 0) {
                // if we reach this circle back to the beginning state, they have finished all of the mixes
                speechOutput += " And you completed all of the mixes!";
            }

            speechOutput += " To play in this scene, say play scene. To move on, say next question.";
            this.response.speak(speechOutput).listen("Say, play scene or next question.");
            this.emit(':responseReady');
        } else {
            //incorrect + hint
            speechOutput =
                getSpeechCon(false) 
                    + " you are almost right! Here is a hint. "
                    + mixMasterElements[stage][level].hint
                    + ". Now let's try that one again. ";
            getPrompt.call(this, speechOutput);
        }
    },
    'PlaySceneIntent': function() {
        // since the user status was already updated, call playScene with the previous state
        let stage = this.attributes['currentStage'];
        let level = parseInt(this.attributes['currentLevel']);
        let tempStage = stage;
        let tempLevel = level - 1;
        if (level == 0) {
            switch(stage) {
                case "easy":
                    tempStage = "hard";
                    break;
                case "medium":
                    tempStage = "easy";
                    break;
                case "hard":
                    tempStage = "medium";
                    break;
                default:
                    getPrompt.call(this, "Could not play scene at this time. ");
            }
            tempLevel = mixMasterElements[tempStage].length - 1;
        }

        playScene.call(this, tempStage, tempLevel);
    },
    'HintIntent': function() {
        let speechOutput = "Here is a hint. " + mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].hint + ". Here it comes again, ";
        getPrompt.call(this, speechOutput);
    },
    'NewGameIntent':function(){
      this.emit('LaunchRequest');
    },

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: let's play a game");
        this.response.listen("You can try: let's play a game");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.emit('AMAZON.HelpIntent');
    }
};


//=========================================================================================================================================
// HELPER FUNCTIONS
//=========================================================================================================================================

function setUserStatus(stage, level) {
    this.attributes['currentStage'] = stage;
    this.attributes['currentLevel'] = level;
    console.log("attributes " + this.attributes['currentStage']);
}

function checkUserStatus() {
    let stage = this.attributes['currentStage'];
    let level = this.attributes['currentLevel'];

    // new user
    if(!stage || !level) {
        setUserStatus.call(this, "easy", 0);
    }

    //account for an incorrect status
    if (parseInt(level) >= mixMasterElements[stage].length) {
        if (stage == 'easy') {
            setUserStatus.call(this, "medium", 0);
        } else if (stage == 'medium') {
            setUserStatus.call(this, "hard", 0);
        } else {
            setUserStatus.call(this, "easy", 0);
        }
    }
}

function getPrompt(speechOutput) {
    checkUserStatus.call(this);

    let stage = this.attributes['currentStage'];
    let level = parseInt(this.attributes['currentLevel']);

    let data = mixMasterElements[stage][level];
    var audio = songs[stage];
    speechOutput += "Think about what " + data.mix[0] + " and " + data.mix[1] + " could make. <audio src='" + audio + "' /> What do they make?";

    this.response.speak(speechOutput).listen("What do " + data.mix[0] + " and " + data.mix[1] + " make?");
    this.emit(':responseReady');
}

function playScene(stage, level) {
    let scene = mixMasterElements[stage][level].scene;
    let audio = mixMasterElements[stage][level].audio;
    let speechOutput = scene + "<audio src='" + audio + "' />" + getSpeechCon(true) + " that was fun! Here comes your next mix master question. ";
    getPrompt.call(this, speechOutput);
}

function getSpeechCon(type) {
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min+1)+min);
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what synonym the person said - .synonym
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
    let slotValues = {};

    console.log(JSON.stringify(filledSlots));

    Object.keys(filledSlots).forEach(function(item) {
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name=filledSlots[item].name;
        //console.log("name: "+name);
        if(filledSlots[item]&&
           filledSlots[item].resolutions &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        "isValidated": filledSlots[item].value == filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name
                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "synonym":filledSlots[item].value,
                        "resolved":filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
                }
            } else {
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved":filledSlots[item].value,
                    "isValidated": false
                };
            }
        },this);
        //console.log("slot values: "+JSON.stringify(slotValues));
        return slotValues;
}

//=========================================================================================================================================
// DATA
//=========================================================================================================================================

const songs = {
    "intro":"https://s3.amazonaws.com/asksounds/happyintro.mp3",
    "easy":"https://s3.amazonaws.com/asksounds/waitingtime1.mp3",
    "medium":"https://s3.amazonaws.com/asksounds/waitingtime3.mp3",
    "hard":"https://s3.amazonaws.com/asksounds/waitingtime2.mp3",
    "correct":"https://s3.amazonaws.com/asksounds/correct1.mp3"
};

const mixMasterElements = {
    "easy": [
        {
            "answer":"mud",
            "mix":["dirt", "water"],
            "hint":"it is sticky and brown",
            "synonyms":[],
            "scene":"Now you are in a stinky smelly swamp! Be careful where you step!",
            "audio":"https://s3.amazonaws.com/asksounds/swamp.mp3"
        },
        {
            "answer":"rain",
            "mix":["clouds", "water"],
            "synonyms":["showers", "thunder", "rain shower", "storm"],
            "hint":"don't forget your umbrella",
            "scene":"You are in a scary thunder storm! Take cover!",
            "audio":"https://s3.amazonaws.com/asksounds/thunder.mp3"
        }
    ],
    "medium": [
        {
            "answer":"space",
            "mix":["stars", "moon"],
            "synonyms":["outerspace", "galaxy"],
            "hint":"do you think aliens exist?",
            "scene":"Now you are deep in space, let's go exploring!",
            "audio":"https://s3.amazonaws.com/asksounds/space.mp3"
        },
        {
            "answer":"snow",
            "mix":["rain", "cold"],
            "synonyms":["frosty", "sleet", "hail", "frost", "winter"],
            "hint":"it is white and fluffy",
            "scene":"Oh boy it is cold! We are in the middle of Antartica!",
            "audio":"https://s3.amazonaws.com/asksounds/wind.mp3"
        }
    ],
    "hard": [
        {
            "answer":"library",
            "mix":["words", "paper"],
            "synonyms":["books", "literature", "bookstore"],
            "hint":"<amazon:effect name='whispered'>Shush! Use your quiet voice!</amazon:effect>",
            "scene":"<amazon:effect name='whispered'>We are in the library, don't make too much noise!</amazon:effect>",
            "audio":"https://s3.amazonaws.com/asksounds/library.mp3"
        },
        {
            "answer":"campfire",
            "mix":["fire", "wood"],
            "synonyms":["bonfire", "camping"],
            "hint":"we can roast marshmellows",
            "scene":"You are at a spooky campsite, I hope there aren't monsters in the forrest!",
            "audio":"https://s3.amazonaws.com/asksounds/campfire.mp3"
        }
    ]
};