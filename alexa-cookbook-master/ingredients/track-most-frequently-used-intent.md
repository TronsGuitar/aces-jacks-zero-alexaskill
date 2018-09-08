# Track Most Frequently Used Intent

From your skill you don't have access to the raw utterance text, but you do know what `intent` 
was invoked, so you can track usage statistics and tailor your experience to the user's habits.
You'll need to set up `dynamoDB` in order to get this to work. Check the 
[recipe lab](http://alexa.design/labs-recipe) for how to set up `dynamoDB`.

Use the following code to track which `intent` was called.

    'NewSession' : function() {
        // Our skill has never been run by this user before so we need to 
        // initialize our intent counter
        if (this.attributes['frequencyCount'] === undefined ) {
            this.attributes['frequencyCount'] = {};
        }

        if (this.event.request.type === 'IntentRequest') {

            // if it doesn't exist in our attributes, it's the first time the intent
            // has been invoked by this user.
            if ( this.attributes.frequencyCount[this.event.request.intent.name] === undefined ) {
                this.attributes.frequencyCount[this.event.request.intent.name] = 0;
            }

            // bump the counter by 1 if it's the first time we set to 0 so it will become 1
            this.attributes.frequencyCount[this.event.request.intent.name]++;

            // you'll need to call the original intent otherwise
            // the skill wont move onto what the user intended  
            this.emit(this.event.request.intent.name); 
        }
    },    
    'LaunchRequest' : function () {
        let mostFrequentlyUsedIntent = findMostFrequentlyUsedIntent(this.attributes.frequencyCount);
        if ( mostFrequentlyUsedIntent !== undefined ) {
            this.emit(mostFrequentlyUsedIntent);
        } else {
            this.response.speak('Welcome to the skill').listen('You can say ...');
            this.emit(':responseReady');
        }
    }

Then add `findMostFrequentlyUsedIntent` to your code

    function findMostFrequentlyUsedIntent(intents) {
        let largest = 0;
        let intent = '';
        for(let key in intents) {
            if (intents.hasOwnProperty(key)) {
                console.log(key, intents[key]);
                if (intents[key] > largest ) {
                    largest = intents[key];
                    intent = key;
                }
            }
        }
        return intent;
    }

If the user says `Alexa open <your invocation name>` and they've used your skill before,
this code will call the most frequently used skill instead of welcoming them as if it were
there first time.

## Food for thought

As written this code determines any intent that has been invoked at least once to be frequently used.
It might be a good idea to add a threshold before returning `intent` from `findMostFrequentlyUsedIntent`.

`return (largest >= 5) ? intent : undefined;`

Doing so will give the user some time to get used to using your skill.

You might also want to consider how to handle a tie. Maybe two `intents` have the same count.
How would you like to resolve that? It might be nice to ask the user. This code will also
count the use for every intent. Maybe you only want to count a few? You can use this code
as a starting point and modify as necessary.