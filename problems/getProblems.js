var request = require('request');

// define access parameters
var accessToken = '9b348449f67afb2fa93a5e53e417b609';
var endpoint = 'ec2e5307.problems.sphere-engine.com';

// define request parameters
var problemId = 139270;

// send request
request({
    url: 'https://' + endpoint + '/api/v4/problems/' + problemId + '?access_token=' + accessToken,
    method: 'GET'
}, function (error, response, body) {

    if (error) {
        console.log('Connection problem');
    }

    // process response
    if (response) {
        if (response.statusCode === 200) {
            console.log(JSON.parse(response.body)); // problem data in JSON
        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 403) {
                console.log('Access denied');
            } else if (response.statusCode === 404) {
                console.log('Problem not found');
            }
        }
    }
});