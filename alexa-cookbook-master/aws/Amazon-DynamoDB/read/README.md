#### Ingredients
## Amazon DynamoDB - Read <a id="title"></a>

Your Lambda function can query a DynamoDB database table for data in order to prepare a custom speech response.

### Instructions for deploying this sample skill


#### Grant DynamoDB permissions via IAM:

1. From the AWS console, click on IAM
1. Locate and click on the role you use with your Lambda functions, such as ```lambda_basic_execution```
1. Click the "Attach Policy" button
1. For a quick demo, filter on "DynamoDB" and attach the ```AmazonDynamoDBReadOnlyAccess``` policy.
1. For a production scenario, choose a more fine-grained policy granting access to certain resources.
 *    Review [IAM Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html)

#### Create a new table:

1. Login to the [AWS Console - DynamoDB](https://console.aws.amazon.com/dynamodb/home)
1. From the left menu, click Tables
1. Click the blue "Create Table" button
 * Table name: ```yesno```
 * Primary Key / Partition Key : ```id```  (string)
1. Click the blue "Create Table" button.  The table will take a minute to be created.
1. Review the details of your new table.
 * At the bottom of the Overview tab, locate the Amazon Resource Name (ARN) for this table.
 * Remember this Table's ARN for future reference
   * example ARN ```arn:aws:dynamodb:eu-west-1:589662300000:table/yesno```

#### Create a table item:

1. Click on the name of your new table
1. Click on the blue "Create Item" button
1. On the top left, click on the dropdown called "Tree" and change it to "Text"
1. Clear all text, then paste in the following JSON, then click "Save"
 * ```{  "id": "0",  "message": "yes" }```

Your table is now ready for use.


 * [Part 2 - Create the skill](./PAGE2.md#title)


<hr />

Back to the [Home Page](../../README.md#title)

