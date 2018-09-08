Break up the Monotony; Vary your Responses
==========================================

When building voice experiences, variety is key. People may not mind
scanning the same webpage times over, but no one wants to have the same
conversation again and again.

Build variety into your skill’s responses to keep customers engaged over
time. For example, think of all the ways that you can say, “OK.” You
might say, “Got it,” “Great,” “Sounds good,” and so on.

You can vary your responses by creating a list of phrases and using a
random number generator to pick something from that list. This approach
will add variety to your skill’s interactions and make your responses
less robotic. To get started, use the following function:

    function randomPhrase(phraseList) {
         let i = Math.floor(Math.random() * phraseList.length);
         return(phraseList[i]);
    }

Javascript is a pass-by-reference for non-primitives so it's not going
to make a fresh copy and consume a ton of memory. If you want to vary
your welcome message, paste the following into your code:

    const welcomeText = 'welcome to Bitcoin exchange I can check the price of Bitcoin';

    const welcomeQuestion = 'Do you want me to check the current price of Bitcoin?';

    const welcomePrompts = [
         "Hello",
         "Howdy", 
         "Hi",
         "Good Day"
    ];

Then call `randomPhrase()` from your welcome `intent` or
`LaunchRequest`.

    'LaunchRequest': function() {
          this.response.speak(`${randomPhrase(welcomePrompts)}, ${welcomeText} ${welcomeQuestion}`)
              .listen(welcomeQuestion);
          this.emit(':responseReady');
    }

We are using [ES6 Template
Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
to stitch together our randomly selected greeting, welcome text, and
question.

The cool thing about this approach is that it can be used anywhere to
vary the response. For example, you can use it to vary single words or
entire phrases. If you take the time to carefully plan out all of your
possible responses and how to mix them, you could randomly combine parts
of sentences into complete coherent sentences for maximum effect.

For a more in-depth look, check out the [quiz
game](https://github.com/alexa/skill-sample-nodejs-quiz-game/blob/master/src/index.js). 
The right and wrong answer responses have been randomized. My favorite is
the one that tricks the user into thinking they had the wrong answer
when they were in fact correct.
