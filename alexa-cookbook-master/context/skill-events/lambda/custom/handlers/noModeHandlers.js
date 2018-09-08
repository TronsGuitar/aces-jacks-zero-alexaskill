'use strict';

const Alexa = require('alexa-sdk');
//Status of list, either active or completed
const STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

/**
 * Fetches list item information for each listItem in listItemIds. Executes the
 * callback function with the response back from api.amazonalexa.com
 * for each item in the list.
 *
 * @param {String} listId list id to check
 * @param {String[]} listItemIds list item ids in the request
 * @param {String} consentToken consent token from Alexa request
 * @param {(String) => void} callback func for each list item
 */
const traverseListItems = (listId, listItemIds, consentToken, callback) => {
    const listClient = new Alexa.services.ListManagementService();
    listItemIds.forEach((itemId) => {
        const listRequest = listClient.getListItem(listId, itemId, consentToken);

        listRequest.then((response) => {
            callback(response);
        }).catch((err) => {
            console.error(err);
        });
    });
};

/**
 * Fetches list information for given list id. Executes the
 * callback function with the response back from api.amazonalexa.com.
 *
 * @param {String} listId list id to check
 * @param {String} status specify either “active” or “completed” items.
 * @param {String} consentToken consent token from Alexa request
 * @param {(String) => void} callback func for the list
 */
const getListInfo = (listId, status, consentToken, callback) => {
    const listClient = new Alexa.services.ListManagementService();
    const listInfo = listClient.getList(listId, status, consentToken);

    listInfo.then((response) => {
        callback(response);
    }).catch((err) => {
        console.error(err);
    });
};

const noModeHandlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'SayHello': function () {
        this.response.speak('Hello World!');
        this.emit(':responseReady');
    },
    'SayHelloName': function () {
        const name = this.event.request.intent.slots.name.value;
        this.response.speak(`Hello ${name}!`);
        this.emit(':responseReady');
    },

    // Skill events
    'AlexaSkillEvent.SkillEnabled' : function() {
        const userId = this.event.context.System.user.userId;

        console.log(`skill was enabled for user: ${userId}`);        
    },
    'AlexaSkillEvent.SkillDisabled' : function() {
        const userId = this.event.context.System.user.userId;
        
        console.log(`skill was disabled for user: ${userId}`);
    },
    'AlexaSkillEvent.SkillPermissionAccepted' : function() {
        const userId = this.event.context.System.user.userId;
        const acceptedPermissions = JSON.stringify(this.event.request.body.acceptedPermissions);

        console.log(`skill permissions were accepted for user ${userId}. New permissions: ${acceptedPermissions}`);
    },
    'AlexaSkillEvent.SkillPermissionChanged' : function() {
        const userId = this.event.context.System.user.userId;
        const acceptedPermissions = JSON.stringify(this.event.request.body.acceptedPermissions);

        console.log(`skill permissions were changed for user ${userId}. New permissions: ${acceptedPermissions}`);
    },
    'AlexaSkillEvent.SkillAccountLinked' : function() {
        const userId = this.event.context.System.user.userId;

        console.log(`skill account was linked for user ${userId}`);
    },

    // Household list events
    'AlexaHouseholdListEvent.ItemsCreated' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const listItemIds = this.event.request.body.listItemIds;
        const status = STATUS.ACTIVE;

        getListInfo(listId, status, consentToken, (list) => {
            traverseListItems(listId, listItemIds, consentToken, (listItem) => {
                const itemName = listItem.value;
                console.log(`${itemName} was added to list ${list.name}`);
            });
        });
    },
    'AlexaHouseholdListEvent.ItemsDeleted' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const listItemIds = this.event.request.body.listItemIds;
        const status = STATUS.ACTIVE;

        getListInfo(listId, status, consentToken, (list) => {
            console.log(`${listItemIds} was deleted from list ${list.name}`);
        });
    },
    'AlexaHouseholdListEvent.ItemsUpdated' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const listItemIds = this.event.request.body.listItemIds;
        const status = STATUS.ACTIVE;

        getListInfo(listId, status, consentToken, (list) => {
            traverseListItems(listId, listItemIds, consentToken, (listItem) => {
                const itemName = listItem.value;
                console.log(`${itemName} was updated on list ${list.name}`);
            });
        });
    },
    'AlexaHouseholdListEvent.ListCreated' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const status = STATUS.ACTIVE;
        
        getListInfo(listId, status, consentToken, (list) => {
            console.log(`list ${list.name} was created`);
        });
    },
    'AlexaHouseholdListEvent.ListUpdated' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const status = STATUS.ACTIVE;

        getListInfo(listId, status, consentToken, (list) => {
            console.log(`list ${list.name} was updated`);
        });
    },
    'AlexaHouseholdListEvent.ListDeleted' : function() {
        const listId = this.event.request.body.listId;
        const consentToken = this.event.context.System.user.permissions.consentToken;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const status = STATUS.ACTIVE;

        console.log(`list ${listId} was deleted`);
    },
};

module.exports = noModeHandlers;
