#### Ingredients
## Amazon DynamoDB - Magic Answers testing page <a id="title"></a>

You can create a web app that makes it easy for a user to update a DynamoDB table.

### Instructions for deploying

*This web page requires a DynamoDB table and item be previously configured, as described within this project*


#### Create a new AWS Cognito Identity Pool

1. Login to the AWS Cognito console
1. Click "Manage Federated Identities"
1. Click "Create new identity pool" called ```magicpool```
 + Check the box to "Enable access to unauthenticated providers"
1. Once your pool is created, click on the "Sample Code" menu item
1. Within your code, find the RED string called Identity Pool ID and remember this as your cognitoIdentityPoolID.

#### Add permissions to users of your Identity Pool:

1. Go to the AWS IAM Console
1. Click Roles
1. Click on the new Unauth role, such as Cognito_magicpoolUnauth_Role
1. Click the "Create Role Policy" button to add the appropriate permissions to your role
1. Within the Policy Generator panel, click "Select"
1. You will define specific permissions for this policy:
 + Effect: Allow
 + AWS Service: ```Amazon DynamoDB```
 + Actions: ```putItem```
 + ARN: The custom ARN for your Dynamo Table, such as ```arn:aws:dynamodb:eu-west-1:589662300000:table/yesno```
1. Click "Add Statement"
1. Click "Apply Policy"


#### Launch the page
 + Open in the page magic.html in your favorite browser.
   + You can open the page right from within your project folder, you do not need to host it on a website.
 + Click the YES and NO buttons.  You should see the "Current Message" label at the top of the page update.  This label only updates after a successful DynamoDB table update.


#### Debug
 * If there is any issue, open your browser's Debug Console and look for any Javascript errors for clues.

#### Play
Click the YES button.  Invite your friend to try your skill.

1. Say "alexa, open magic answers"
1. Say "am I a good developer?"
 + Alexa responds with "yes"
1. Have your friend ask additional questions.
1. Click YES or NO as the person is asking the question.
 + Alexa will give the correct answer.


<hr />

Back to the [Project Page](../../README.md#title)

