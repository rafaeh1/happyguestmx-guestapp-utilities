'use strict';

/*!
 * This module helps to manage guest users in happy guest guestApp
 * 0.6
 */

const AWS = require('aws-sdk'),
	env = process.env;

AWS.config.update({
	region: env.REGION
});

const cognito = new AWS.CognitoIdentityServiceProvider(),
	dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient();

async function getUserFromJWT(AccessToken, fields = []) {
	try {
		let user = await cognito.getUser({
			AccessToken
		}).promise();
		let sub = user["UserAttributes"][0].Value;
		user = await getUserFromTable(sub, fields);
		return user;
	} catch (err) {
		throw (err);
	}

};

async function getCognitoUser(AccessToken) {
	try {
		let user = await cognito.getUser({
			AccessToken
		}).promise();
		return user;
	} catch (err) {
		throw (err);
	}
};

async function getUserFromTable(uuid, fields = []) {
	try {
		let params = {
			TableName: env.DBB_GUEST_USERS_TABLE,
			Key: {
				'uuid': uuid
			},
			ExpressionAttributeValues: {
				':uuid': uuid
			},
		};
		if (fields.length > 0) {
			params = await pushParamstoObject(fields, params);
		}
		let user = await dynamodbDocumentClient.get(params).promise();
		if (objectIsEmpty(user)) throw "user not found";
		else return user.Item;
	} catch (err) {
		throw (err);
	}
};

async function cognitoUserAsJson(AccessToken) {
	try {
		let cognitoUser = {};
		let user = await cognito.getUser({
			AccessToken: AccessToken
		}).promise();
		user = await userToJSON(user);
		return user;
	} catch (err) {
		throw (err);
	}
};

async function userToJSON(user) {
	try {
		let cognitoUser = {};
		for (const attribute of user.UserAttributes) {
			cognitoUser[attribute.Name] = attribute.Value;
		}
		return cognitoUser;
	} catch (err) {
		throw (err);
	}
}

function objectIsEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

async function pushParamstoObject(arr, object) {
	try {
		let params = object;
		if (!params.ProjectionExpression) params.ProjectionExpression = '';
		if (!params.ExpressionAttributeNames) params.ExpressionAttributeNames = {};
		arr.forEach((value, index) => {
			params.ProjectionExpression += `#${value}`;
			params.ProjectionExpression += index < arr.length - 1 ? ',' : '';
			params['ExpressionAttributeNames'][`#${value}`] = value;
		});
		return params;
	} catch (err) {
		throw (err);
	}
}

module.exports = {
	getUserFromJWT,
	getCognitoUser,
	getUserFromTable,
	cognitoUserAsJson
}
