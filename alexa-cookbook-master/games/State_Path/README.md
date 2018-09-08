
### Alexa Skill Building Cookbook
## State Path Game<a id="title"></a>


#### Welcome! <a id="intro"></a>

This project provides everything you will need to build a copy of the public skill called State Games.
State Games is a geography game that uses a map of the United States as a playing field. The user takes several turns, each time providing the name of a state.  Each new state must border the previously named states, and follow any other game rules as defined.

You can [enable State Games](https://www.amazon.com/Robert-McCauley-State-Games/dp/B0738WZNB1/ref=sr_1_2?s=digital-skills&ie=UTF8&qid=1511774116&sr=1-2&keywords=state+games) to see how it works.

The game includes an optional map component, which you can launch via [alexa.design/stategames](https://alexa.design/stategames)
This map is a web application that connects to the AWS IOT service via Cognito,
and will receive updates from AWS triggered by utterances within the skill.


#### Pre-requisites
This skill assumes you have practiced building and configuring other skills from the alexa-cookbook,
such as the [City Guide](https://alexa.design/labs-local).
You must also have successfully built the [City Browser IOT skill](https://alexa.design/labs-iot) skill, which is the basis for the connected web application.


#### Create this skill
This skill sample project is called **State Path**, in order to distinguish it from the existing **State Games** public skill.


High level steps:
1. Be sure you have downloaded the [alexa-cookbook](https://github.com/alexa/alexa-cookbook) to a folder on your laptop hard drive.
1. Go to the AWS Console, navigate to the AWS IOT service, click Registry, and create a new "thing" called **map**.  Locate and record the MQTT Rest API Endpoint associated with this thing.
1. Navigate to the ```lambda/custom/index.js``` file and copy this to create a new Lambda Function (based on the fact blueprint).
1. Modify the ```config.IOT_BROKER_ENDPOINT``` value within the Lambda function code.
1. Within the IAM console, open your Lambda role such as ```lambda-basic-execution``` and attach a policy for ```IOTFullAccess```
1. Create a skill called State Path using the interaction model found in the ```models/en-US.json``` file.
1. Navigate on your hard drive to the ```webapp/js``` folder and modify the ```aws_config.js``` file as you did previously in the IOT skill (see pre-requisites).  You can use the same Cognito Pool ID as before.
1. Launch the file called ```webapp/game.html``` and you should see a greeen status saying CONNECTED.
1. Begin invoking the skill with an utterance such as "Alexa, ask state path to play coast to coast".  You should be guided through the rules and play of the game.  The browser map should update and highlight each state you say.


<hr />

Back to the [github.com/alexa/alexa-cookbook](https://github.com/alexa/alexa-cookbook) home page.

